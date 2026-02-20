-- =========================================================
-- ⚡ FINAL FIX: TABLES, DATA, AND PERMISSIONS
-- Run this in Supabase SQL Editor
-- =========================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  role text,
  full_name text,
  email text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  plan_name text,
  billing_period text, 
  start_date date,
  end_date date,
  max_employees integer,
  max_devices integer,
  max_monthly_hours integer,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- 2. Ensure Company "0000...001" Exists (Used by Frontend)
INSERT INTO public.companies (id, name, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'الشركة الرئيسية', now())
ON CONFLICT (id) DO NOTHING;

-- 3. Ensure Subscription for "0000...001" Exists
INSERT INTO public.company_subscriptions (
  company_id, plan_name, billing_period, start_date, end_date, max_employees, max_devices, max_monthly_hours, status
) VALUES (
  '00000000-0000-0000-0000-000000000001', 'Enterprise', 'annual', '2024-01-01', '2030-12-31', 1000, 100, 100000, 'active'
) ON CONFLICT DO NOTHING;

-- 4. Add Columns to Employees
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS role text,
ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8,
ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;

-- 5. Fix Permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. Permissions Policies (Open for now to fix access)
CREATE POLICY "Public Read" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Sub" ON public.company_subscriptions FOR SELECT USING (true);

-- 7. Refresh
NOTIFY pgrst, 'reload config';
