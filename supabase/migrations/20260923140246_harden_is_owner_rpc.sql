-- The admin client must ask this function instead of selecting directly from
-- owner_accounts, which intentionally has RLS enabled and no SELECT policy.
-- The empty search_path and qualified names prevent object-shadowing attacks
-- in this SECURITY DEFINER function.
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

-- Remove the default PUBLIC execute grant. Only authenticated sessions need
-- to invoke this function through the Supabase RPC endpoint and RLS policies.
revoke all on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;
