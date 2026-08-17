-- ============================================================================
-- mmoptibuilds — enquiry intake
--
-- Design notes:
--   * Visitors submit as GUESTS. There is no visitor account, so the anon role
--     must be able to INSERT but must never be able to SELECT. A leaked
--     publishable key must not expose a single enquiry.
--   * The owner is the only reader. Owner access is granted by an allowlist of
--     user ids in `owner_accounts`, not by a JWT claim that a client could
--     influence.
--   * Submitted content is immutable. The owner works in separate columns
--     (status, priority, notes, quote) so the visitor's words are never edited.
--   * Every write records the consent notice version actually shown.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Enumerations ────────────────────────────────────────────────────────────

create type enquiry_intent as enum (
  'system-build',
  'enterprise-rfq',
  'studio-brief'
);

create type enquiry_division as enum ('systems', 'studio');

create type enquiry_status as enum (
  'new',
  'reviewing',
  'quoted',
  'won',
  'lost',
  'spam',
  'duplicate',
  'archived'
);

create type enquiry_priority as enum ('low', 'normal', 'high');

-- ── Owner allowlist ─────────────────────────────────────────────────────────
-- Membership here is what makes a signed-in user the owner. Rows are inserted
-- manually via the service role; nothing in the app can add to this table.

create table owner_accounts (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  label      text not null,
  created_at timestamptz not null default now()
);

alter table owner_accounts enable row level security;
-- No policies: unreachable except via the service role. Deliberate.

create or replace function is_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from owner_accounts where user_id = auth.uid()
  );
$$;

-- ── Enquiries ───────────────────────────────────────────────────────────────

create table enquiries (
  id                uuid primary key default gen_random_uuid(),

  -- Human-quotable handle given to the visitor on screen and used in email.
  reference         text not null unique,

  intent            enquiry_intent not null,
  division          enquiry_division not null,

  -- Contact. Kept as discrete columns because they are queried and displayed
  -- on every dashboard row.
  contact_name      text not null,
  contact_email     text not null,
  contact_phone     text,

  -- Everything else the visitor typed, exactly as submitted and validated.
  -- JSONB because the three intents have genuinely different field sets and
  -- a shared wide table would be mostly nulls.
  payload           jsonb not null,

  -- Provenance and consent.
  source_path       text,
  consent_version   text not null,
  consent_at        timestamptz not null default now(),

  -- Privacy-safe abuse signals. Deliberately NOT a raw IP address: a salted
  -- hash is enough to rate-limit and to spot a flood, without storing a
  -- personal identifier (spec 14).
  abuse_fingerprint text,
  turnstile_ok      boolean not null default false,
  completion_ms     integer,

  -- Idempotency: a double-tapped submit button must not create two rows.
  submission_hash   text not null unique,

  created_at        timestamptz not null default now(),

  -- ── Owner working columns. Only these may ever be updated. ──
  status            enquiry_status not null default 'new',
  priority          enquiry_priority not null default 'normal',
  owner_notes       text,
  quote_amount      numeric(12, 2),
  quote_currency    text default 'INR',
  follow_up_on      date,
  updated_at        timestamptz not null default now()
);

create index enquiries_created_idx  on enquiries (created_at desc);
create index enquiries_status_idx   on enquiries (status);
create index enquiries_division_idx on enquiries (division, created_at desc);
create index enquiries_email_idx    on enquiries (contact_email);

alter table enquiries enable row level security;

-- Guests may INSERT and nothing else. There is deliberately no SELECT policy
-- for anon, so the publishable key cannot read enquiries back.
create policy "guests may submit an enquiry"
  on enquiries for insert
  to anon, authenticated
  with check (true);

create policy "owner reads every enquiry"
  on enquiries for select
  to authenticated
  using (is_owner());

create policy "owner updates working columns"
  on enquiries for update
  to authenticated
  using (is_owner())
  with check (is_owner());

-- Nobody deletes enquiries through the API. Retention is a manual, audited
-- operation via the service role.

-- ── Immutability of submitted content ───────────────────────────────────────
-- The owner can triage, but cannot rewrite what the visitor actually said.

create or replace function enquiries_protect_submitted()
returns trigger
language plpgsql
as $$
begin
  if new.reference        is distinct from old.reference
  or new.intent           is distinct from old.intent
  or new.division         is distinct from old.division
  or new.contact_name     is distinct from old.contact_name
  or new.contact_email    is distinct from old.contact_email
  or new.contact_phone    is distinct from old.contact_phone
  or new.payload          is distinct from old.payload
  or new.consent_version  is distinct from old.consent_version
  or new.consent_at       is distinct from old.consent_at
  or new.submission_hash  is distinct from old.submission_hash
  or new.created_at       is distinct from old.created_at
  then
    raise exception 'submitted enquiry content is immutable';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger enquiries_protect_submitted_trg
  before update on enquiries
  for each row execute function enquiries_protect_submitted();

-- ── Audit trail ─────────────────────────────────────────────────────────────
-- Append-only. Written by a trigger so a forgotten call site cannot skip it.

create table enquiry_events (
  id          bigserial primary key,
  enquiry_id  uuid not null references enquiries (id) on delete cascade,
  actor       uuid references auth.users (id),
  kind        text not null,
  detail      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index enquiry_events_enquiry_idx on enquiry_events (enquiry_id, created_at desc);

alter table enquiry_events enable row level security;

create policy "owner reads audit history"
  on enquiry_events for select
  to authenticated
  using (is_owner());

-- No insert/update/delete policies: only the trigger (definer) writes here.

create or replace function enquiries_log_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into enquiry_events (enquiry_id, kind, detail)
    values (new.id, 'received', jsonb_build_object(
      'intent', new.intent,
      'division', new.division,
      'source_path', new.source_path,
      'turnstile_ok', new.turnstile_ok
    ));
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into enquiry_events (enquiry_id, actor, kind, detail)
    values (new.id, auth.uid(), 'status_changed', jsonb_build_object(
      'from', old.status, 'to', new.status
    ));
  end if;

  if new.priority is distinct from old.priority then
    insert into enquiry_events (enquiry_id, actor, kind, detail)
    values (new.id, auth.uid(), 'priority_changed', jsonb_build_object(
      'from', old.priority, 'to', new.priority
    ));
  end if;

  if new.quote_amount is distinct from old.quote_amount then
    insert into enquiry_events (enquiry_id, actor, kind, detail)
    values (new.id, auth.uid(), 'quote_recorded', jsonb_build_object(
      'amount', new.quote_amount, 'currency', new.quote_currency
    ));
  end if;

  if new.owner_notes is distinct from old.owner_notes then
    -- The note body is not copied into the audit row: the note itself lives on
    -- the enquiry, and duplicating it here would double the places to redact.
    insert into enquiry_events (enquiry_id, actor, kind)
    values (new.id, auth.uid(), 'note_edited');
  end if;

  return new;
end;
$$;

create trigger enquiries_log_insert_trg
  after insert on enquiries
  for each row execute function enquiries_log_change();

create trigger enquiries_log_update_trg
  after update on enquiries
  for each row execute function enquiries_log_change();

-- ── Rate limiting ───────────────────────────────────────────────────────────
-- Counts recent submissions for a fingerprint. Definer so it can read the
-- table without granting the caller SELECT on enquiries.

create or replace function recent_submission_count(fingerprint text, window_minutes integer default 60)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from enquiries
  where abuse_fingerprint = fingerprint
    and created_at > now() - make_interval(mins => window_minutes);
$$;

revoke all on function recent_submission_count(text, integer) from public;
grant execute on function recent_submission_count(text, integer) to anon, authenticated;
