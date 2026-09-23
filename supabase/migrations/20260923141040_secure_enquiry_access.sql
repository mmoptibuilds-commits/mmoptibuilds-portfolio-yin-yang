-- Public form submissions use the anon role, but must not be able to read,
-- delete, or write owner-only workflow fields. Authenticated owner reads and
-- updates remain constrained by RLS and column privileges.
revoke all on table public.owner_accounts from public, anon, authenticated;
revoke all on table public.enquiries from public, anon, authenticated;
revoke all on table public.enquiry_events from public, anon, authenticated;

grant insert (
  reference,
  intent,
  division,
  contact_name,
  contact_email,
  contact_phone,
  payload,
  source_path,
  consent_version,
  consent_at,
  abuse_fingerprint,
  turnstile_ok,
  completion_ms,
  submission_hash
) on table public.enquiries to anon, authenticated;

grant select on table public.enquiries to authenticated;
grant update (status, priority, owner_notes, quote_amount, follow_up_on)
  on table public.enquiries to authenticated;
grant select on table public.enquiry_events to authenticated;

-- Tighten every function used by the application. SECURITY DEFINER functions
-- use an empty search_path and schema-qualified relations to prevent name
-- shadowing. The backend secret is the only caller of the rate-limit and
-- audit functions; is_owner remains callable by signed-in users for RPC/RLS.
create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.owner_accounts
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

create or replace function public.recent_submission_count(
  fingerprint text,
  window_minutes integer default 60
)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.enquiries
  where abuse_fingerprint = fingerprint
    and created_at > pg_catalog.now() - pg_catalog.make_interval(mins => window_minutes);
$$;

revoke all on function public.recent_submission_count(text, integer)
  from public, anon, authenticated;
grant execute on function public.recent_submission_count(text, integer) to service_role;

create or replace function public.enquiries_log_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.enquiry_events (enquiry_id, kind, detail)
    values (new.id, 'received', pg_catalog.jsonb_build_object(
      'intent', new.intent,
      'division', new.division,
      'source_path', new.source_path,
      'turnstile_ok', new.turnstile_ok
    ));
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.enquiry_events (enquiry_id, actor, kind, detail)
    values (new.id, auth.uid(), 'status_changed', pg_catalog.jsonb_build_object(
      'from', old.status, 'to', new.status
    ));
  end if;

  if new.priority is distinct from old.priority then
    insert into public.enquiry_events (enquiry_id, actor, kind, detail)
    values (new.id, auth.uid(), 'priority_changed', pg_catalog.jsonb_build_object(
      'from', old.priority, 'to', new.priority
    ));
  end if;

  if new.quote_amount is distinct from old.quote_amount then
    insert into public.enquiry_events (enquiry_id, actor, kind, detail)
    values (new.id, auth.uid(), 'quote_recorded', pg_catalog.jsonb_build_object(
      'amount', new.quote_amount, 'currency', new.quote_currency
    ));
  end if;

  if new.owner_notes is distinct from old.owner_notes then
    insert into public.enquiry_events (enquiry_id, actor, kind)
    values (new.id, auth.uid(), 'note_edited');
  end if;

  return new;
end;
$$;

revoke all on function public.enquiries_log_change() from public, anon, authenticated;
grant execute on function public.enquiries_log_change() to service_role;

create or replace function public.enquiries_protect_submitted()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id                is distinct from old.id
  or new.reference         is distinct from old.reference
  or new.intent            is distinct from old.intent
  or new.division          is distinct from old.division
  or new.contact_name      is distinct from old.contact_name
  or new.contact_email     is distinct from old.contact_email
  or new.contact_phone     is distinct from old.contact_phone
  or new.payload           is distinct from old.payload
  or new.source_path       is distinct from old.source_path
  or new.consent_version   is distinct from old.consent_version
  or new.consent_at        is distinct from old.consent_at
  or new.abuse_fingerprint is distinct from old.abuse_fingerprint
  or new.turnstile_ok      is distinct from old.turnstile_ok
  or new.completion_ms     is distinct from old.completion_ms
  or new.submission_hash   is distinct from old.submission_hash
  or new.created_at        is distinct from old.created_at
  or new.quote_currency    is distinct from old.quote_currency
  then
    raise exception 'submitted enquiry content is immutable';
  end if;

  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

-- The existing audit index starts with enquiry_id; this separate index covers
-- auth.users deletion checks on the actor foreign key.
create index if not exists enquiry_events_actor_idx
  on public.enquiry_events (actor);
