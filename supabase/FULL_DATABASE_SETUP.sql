-- ==============================================================================
-- 🛑 MASTER DATABASE SETUP SCRIPT (HR SYSTEM)
-- 
-- DESCRIPTION:
-- This script reconstructs the entire database schema for the HR System.
-- It works idempotently (safe to run multiple times).
-- It ensures all tables, columns, permissions, and initial data exist.
-- 
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard -> SQL Editor
-- 2. Paste this entire script
-- 3. Click RUN
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Enable Extensions
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. Create Tables (Core Structure)
-- ------------------------------------------------------------------------------

-- [Companies]
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add extended columns for Companies (if missing)
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS name_en text;

-- [Departments]
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add extended columns for Departments
ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS manager_id uuid, -- Link to employee
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'; -- active/inactive

-- [Biometric Devices]
CREATE TABLE IF NOT EXISTS public.biometric_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  device_name text NOT NULL,
  device_type text CHECK (device_type IN ('ZKTeco', 'FingerTec')),
  ip_address text,
  port integer,
  serial_number text,
  device_token text,
  status text DEFAULT 'active',
  last_sync_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- [Employees]
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

-- Add extended columns for Employees
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS role text, -- e.g. 'Manager', 'Accountant'
ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8,
ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;

-- [User Profiles] (Links Auth Users to HR System)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  role text CHECK (role IN ('super_admin', 'company_admin', 'hr_manager', 'employee')),
  full_name text,
  email text,
  -- user_id column might be used by some legacy code, we ensure it exists
  user_id uuid, 
  created_at timestamptz DEFAULT now()
);

-- [Company Subscriptions]
CREATE TABLE IF NOT EXISTS public.company_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  plan_name text,
  billing_period text CHECK (billing_period IN ('monthly', 'annual')),
  start_date date,
  end_date date,
  max_employees integer DEFAULT 0,
  max_devices integer DEFAULT 0,
  max_monthly_hours integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- [Attendance Records]
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id),
  date date NOT NULL,
  check_in timestamptz,
  check_out timestamptz,
  total_hours numeric,
  late_minutes integer DEFAULT 0,
  overtime_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add extended columns for Attendance
ALTER TABLE public.attendance_records 
ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS status text, -- present, absent, late, leave
ADD COLUMN IF NOT EXISTS notes text;

-- [Raw Attendance Logs]
CREATE TABLE IF NOT EXISTS public.raw_attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  device_id uuid REFERENCES public.biometric_devices(id),
  biometric_user_id text NOT NULL,
  timestamp timestamptz NOT NULL,
  log_type text CHECK (log_type IN ('check_in', 'check_out')),
  created_at timestamptz DEFAULT now()
);

-- [Leave Requests]
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  employee_id uuid REFERENCES public.employees(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text DEFAULT 'pending', -- pending, approved, rejected
  created_at timestamptz DEFAULT now()
);

-- [Payroll]
CREATE TABLE IF NOT EXISTS public.payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id),
  base_salary numeric,
  deductions numeric DEFAULT 0,
  overtime_amount numeric DEFAULT 0,
  net_salary numeric,
  month date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. Create Indexes (Performance)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_employees_company ON public.employees(company_id);
CREATE INDEX IF NOT EXISTS idx_departments_company ON public.departments(company_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON public.attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_company ON public.attendance_records(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_company ON public.company_subscriptions(company_id);

-- ------------------------------------------------------------------------------
-- 4. Initial Seed Data (Vital for First Run)
-- ------------------------------------------------------------------------------

-- Ensure Main Company exists (Safe Insert)
INSERT INTO public.companies (id, name, name_en, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'الشركة الرئيسية', 
  'Main Company', 
  now()
) ON CONFLICT (id) DO NOTHING;

-- Ensure Main Company has Active Subscription
INSERT INTO public.company_subscriptions (
  company_id, plan_name, billing_period, start_date, end_date, max_employees, max_devices, max_monthly_hours, status
) VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Enterprise Plan', 
  'annual', 
  '2024-01-01', 
  '2030-12-31', 
  1000, 
  100, 
  100000, 
  'active'
) ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. Security & Permissions (Fixes PGRST errors)
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- Grant usage to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 6. RLS Policies (Permissive for Setup Phase)
-- ------------------------------------------------------------------------------
-- Drop existing policies to avoid conflicts if they exist
DROP POLICY IF EXISTS "Public Read Companies" ON public.companies;
DROP POLICY IF EXISTS "Public Write Companies" ON public.companies;
DROP POLICY IF EXISTS "Public Access All" ON public.user_profiles;

-- Create simple policies (OPEN ACCESS for demo/dev)
-- WARNING: Lock this down in production!
CREATE POLICY "Enable access for all users" ON public.companies FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.departments FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.employees FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.attendance_records FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.company_subscriptions FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.leave_requests FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.biometric_devices FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.raw_attendance_logs FOR ALL USING (true);
CREATE POLICY "Enable access for all users" ON public.payroll FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 7. Final Refresh
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload config';
