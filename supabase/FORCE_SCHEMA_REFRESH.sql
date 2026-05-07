-- FORCE REFRESH SCHEMA CACHE
-- The error PGRST205 "Could not find the table 'public.user_profiles' in the schema cache"
-- means PostgREST still thinks the table doesn't exist even after you created it.

-- 1. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload config';

-- 2. As a backup, simply disable and re-enable RLS on the new tables
-- This often forces a schema refresh
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE company_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Double check permissions (grant access to authenticated and anon roles if needed)
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO service_role;
GRANT ALL ON company_subscriptions TO authenticated;
GRANT ALL ON company_subscriptions TO service_role;

-- 4. Verify table existence
select * from user_profiles limit 1;
