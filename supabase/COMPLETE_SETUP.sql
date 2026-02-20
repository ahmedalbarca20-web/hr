-- =============================================
-- ✅ COMPLETE DATABASE SETUP (Final Fix)
-- Run this ENTIRE script in Supabase SQL Editor
-- =============================================

-- 1. Create table: user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  role text NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'hr_manager', 'employee')),
  full_name text,
  email text,
  user_id uuid, -- For legacy compatibility if needed
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company_id);

-- 2. Create table: company_subscriptions
CREATE TABLE IF NOT EXISTS public.company_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id),
  plan_name text NOT NULL,
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  max_employees integer NOT NULL DEFAULT 0,
  max_devices integer NOT NULL DEFAULT 0,
  max_monthly_hours integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for subscriptions
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company ON public.company_subscriptions(company_id);

-- 3. Fix Permissions (Crucial for PGRST205 error)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.company_subscriptions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.companies TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.departments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.employees TO anon, authenticated, service_role;

-- 4. Enable/Refresh RLS to force schema cache reload
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
CREATE POLICY "Admins can read all profiles" ON public.user_profiles
  FOR SELECT USING (true); -- Simplified for setup, restrict later

DROP POLICY IF EXISTS "Public read subscriptions" ON public.company_subscriptions;
CREATE POLICY "Public read subscriptions" ON public.company_subscriptions
  FOR SELECT USING (true);

-- 6. Reload Config
NOTIFY pgrst, 'reload config';
