-- =============================================
-- ✅ FIX: COLUMNS AND POLICIES (Safe Run)
-- Run this in Supabase SQL Editor to fix everything
-- =============================================

-- 1. Fix Missing Columns in Departments
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES public.employees(id);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS description text;

-- 2. Fix Policies (Drop first to avoid "already exists" error)
DROP POLICY IF EXISTS "Access All" ON public.companies;
DROP POLICY IF EXISTS "Access All" ON public.departments;
DROP POLICY IF EXISTS "Access All" ON public.employees;
DROP POLICY IF EXISTS "Access All" ON public.user_profiles;
DROP POLICY IF EXISTS "Access All" ON public.attendance_records;
DROP POLICY IF EXISTS "Access All" ON public.company_subscriptions;

-- 3. Re-create Policies
CREATE POLICY "Access All" ON public.companies FOR ALL USING (true);
CREATE POLICY "Access All" ON public.departments FOR ALL USING (true);
CREATE POLICY "Access All" ON public.employees FOR ALL USING (true);
CREATE POLICY "Access All" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Access All" ON public.attendance_records FOR ALL USING (true);
CREATE POLICY "Access All" ON public.company_subscriptions FOR ALL USING (true);

-- 4. Refresh Cache
NOTIFY pgrst, 'reload config';
