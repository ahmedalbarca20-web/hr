-- ==============================================================================
-- 🛑 FINAL FIX MASTER SCRIPT (Idempotent & Complete)
-- Run this in Supabase SQL Editor to fix ALL issues safely including TASKS & DEVICES.
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ensure ALL Tables Exist
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  name_en text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  full_name text NOT NULL,
  email text,
  biometric_id text,
  department_id uuid REFERENCES public.departments(id),
  salary numeric,
  hire_date date,
  status text DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  role text,
  full_name text,
  email text,
  user_id uuid, 
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES public.employees(id),
  assigned_by uuid REFERENCES public.user_profiles(id),
  due_date date,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  plan_name text,
  billing_period text,
  start_date date,
  end_date date,
  max_employees integer DEFAULT 1000,
  max_devices integer DEFAULT 100,
  max_monthly_hours integer DEFAULT 100000,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id),
  company_id uuid REFERENCES public.companies(id),
  date date NOT NULL,
  check_in timestamptz,
  check_out timestamptz,
  total_hours numeric,
  late_minutes integer DEFAULT 0,
  overtime_minutes integer DEFAULT 0,
  status text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  employee_id uuid REFERENCES public.employees(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.biometric_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  device_name text NOT NULL,
  device_type text,
  ip_address text,
  port integer,
  serial_number text,
  device_token text,
  status text DEFAULT 'active',
  last_sync_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.raw_attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  device_id uuid REFERENCES public.biometric_devices(id),
  biometric_user_id text NOT NULL,
  timestamp timestamptz NOT NULL,
  log_type text,
  created_at timestamptz DEFAULT now()
);

-- 3. Add ALL Missing Columns (Safe 'IF NOT EXISTS')
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES public.employees(id);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS salary numeric;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS hire_date date;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS biometric_id text;

-- Biometric Devices Extra Columns
ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS firmware_version text;
ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS last_activity timestamptz;
-- comm_key handling (optional)
ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS comm_key text DEFAULT '0';
ALTER TABLE public.biometric_devices ALTER COLUMN comm_key DROP NOT NULL;
ALTER TABLE public.biometric_devices ALTER COLUMN comm_key SET DEFAULT '0';

-- 4. Fix Permissions & Policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Access All" ON public.companies;
DROP POLICY IF EXISTS "Access All" ON public.departments;
DROP POLICY IF EXISTS "Access All" ON public.employees;
DROP POLICY IF EXISTS "Access All" ON public.user_profiles;
DROP POLICY IF EXISTS "Access All" ON public.attendance_records;
DROP POLICY IF EXISTS "Access All" ON public.company_subscriptions;
DROP POLICY IF EXISTS "Access All" ON public.leave_requests;
DROP POLICY IF EXISTS "Access All" ON public.biometric_devices;
DROP POLICY IF EXISTS "Access All" ON public.raw_attendance_logs;
DROP POLICY IF EXISTS "Access All" ON public.tasks;

-- Re-create policies (Open Access for development)
CREATE POLICY "Access All" ON public.companies FOR ALL USING (true);
CREATE POLICY "Access All" ON public.departments FOR ALL USING (true);
CREATE POLICY "Access All" ON public.employees FOR ALL USING (true);
CREATE POLICY "Access All" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Access All" ON public.attendance_records FOR ALL USING (true);
CREATE POLICY "Access All" ON public.company_subscriptions FOR ALL USING (true);
CREATE POLICY "Access All" ON public.leave_requests FOR ALL USING (true);
CREATE POLICY "Access All" ON public.biometric_devices FOR ALL USING (true);
CREATE POLICY "Access All" ON public.raw_attendance_logs FOR ALL USING (true);
CREATE POLICY "Access All" ON public.tasks FOR ALL USING (true);

-- 5. Ensure Main Company Data Exists
INSERT INTO public.companies (id, name, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'الشركة الرئيسية', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.company_subscriptions (
  company_id, plan_name, billing_period, start_date, end_date, max_employees, status
) VALUES (
  '00000000-0000-0000-0000-000000000001', 'Enterprise', 'annual', '2024-01-01', '2030-12-31', 1000, 'active'
) ON CONFLICT DO NOTHING;

-- 6. Final Refresh
NOTIFY pgrst, 'reload config';
