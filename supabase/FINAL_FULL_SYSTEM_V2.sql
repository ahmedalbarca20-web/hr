-- ================================================================
-- HR PRO V2 - FULL SYSTEM INSTALLATION SCRIPT
-- Contains: Base System + All V2 Features (Assets, ATS, Docs, AI)
-- ================================================================

-- 1. COMPANIES & USERS (Base)
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    subscription_plan text DEFAULT 'free',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password text NOT NULL, -- In real app, use Supabase Auth
    role text DEFAULT 'employee', -- admin, manager, employee
    company_id uuid REFERENCES public.companies(id),
    created_at timestamptz DEFAULT now()
);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id),
    name text NOT NULL,
    manager_id uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT now()
);

-- 3. EMPLOYEES
CREATE TABLE IF NOT EXISTS public.employees (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id),
    department_id uuid REFERENCES public.departments(id),
    user_id uuid REFERENCES public.users(id),
    full_name text NOT NULL,
    email text,
    phone text,
    salary decimal(10,2),
    hire_date date,
    status text DEFAULT 'active',
    biometric_id text, -- ID on ZKTeco Device
    work_hours_per_day decimal(4,2) DEFAULT 8,
    work_hours_per_week decimal(4,2) DEFAULT 40,
    role text, 
    created_at timestamptz DEFAULT now()
);

-- 4. ATTENDANCE & PAYROLL & LEAVES & TASKS (Base Features)
CREATE TABLE IF NOT EXISTS public.attendance (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id uuid REFERENCES public.employees(id),
    check_in timestamptz,
    check_out timestamptz,
    date date,
    status text, -- present, absent, late
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payroll (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id uuid REFERENCES public.employees(id),
    month text, -- 2024-01
    basic_salary decimal(10,2),
    allowances decimal(10,2) DEFAULT 0,
    deductions decimal(10,2) DEFAULT 0,
    net_salary decimal(10,2),
    status text DEFAULT 'pending', -- pending, paid
    payment_date date,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leaves (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id uuid REFERENCES public.employees(id),
    type text, -- sick, annual, unpaid
    start_date date,
    end_date date,
    status text DEFAULT 'pending', -- pending, approved, rejected
    reason text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id),
    title text NOT NULL,
    description text,
    assigned_to uuid REFERENCES public.employees(id),
    status text DEFAULT 'pending', -- pending, in_progress, completed
    due_date timestamptz,
    priority text DEFAULT 'medium',
    created_at timestamptz DEFAULT now()
);

-- 5. BIOMETRIC DEVICES (Fixed)
CREATE TABLE IF NOT EXISTS public.biometric_devices (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id),
    ip_address text NOT NULL,
    port int DEFAULT 4370,
    name text,
    status text DEFAULT 'offline',
    last_activity timestamptz,
    location text,
    firmware_version text,
    serial_number text,
    comm_key int DEFAULT 0,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Ensure columns exist (Fix for existing tables)
DO $$
BEGIN
    ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS comm_key int DEFAULT 0;
    ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS location text;
    ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS firmware_version text;
    ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS serial_number text;
    ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS notes text;
    ALTER TABLE public.biometric_devices ADD COLUMN IF NOT EXISTS last_activity timestamptz;
END $$;


-- ================================================================
-- V2 FEATURES (NEW)
-- ================================================================

-- 6. ASSETS MANAGEMENT
CREATE TABLE IF NOT EXISTS public.assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id),
    employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL, 
    name text NOT NULL, 
    type text NOT NULL, 
    serial_number text, 
    purchase_date date, 
    value decimal(10,2) DEFAULT 0, 
    status text DEFAULT 'in_store', 
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 7. DOCUMENTS
CREATE TABLE IF NOT EXISTS public.employee_documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
    title text NOT NULL, 
    file_url text, 
    expiry_date date, 
    is_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 8. RECRUITMENT (ATS)
CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id),
    title text NOT NULL,
    department_id uuid REFERENCES public.departments(id),
    type text DEFAULT 'full_time',
    location text,
    description text,
    requirements text,
    salary_range_min decimal(10,2),
    salary_range_max decimal(10,2),
    status text DEFAULT 'open', 
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.candidates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    email text,
    phone text,
    resume_url text,
    status text DEFAULT 'new',
    rating int DEFAULT 0,
    notes text,
    applied_at timestamptz DEFAULT now()
);

-- 9. PERFORMANCE AI
CREATE TABLE IF NOT EXISTS public.performance_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
    reviewer_id uuid REFERENCES public.users(id),
    review_period text, 
    score int DEFAULT 0, 
    strengths text,
    weaknesses text,
    goals text,
    is_ai_generated boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- ================================================================
-- SECURITY & POLICIES (Full Reset)
-- ================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

-- Clean old policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.' || r.tablename;
    END LOOP;
END $$;

-- Create OPEN ACCESS Policies (For Development/Testing)
CREATE POLICY "Public Access" ON public.companies FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.users FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.departments FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.employees FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.payroll FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.leaves FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.tasks FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.biometric_devices FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.assets FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.employee_documents FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.jobs FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.candidates FOR ALL USING (true);
CREATE POLICY "Public Access" ON public.performance_reviews FOR ALL USING (true);

-- ================================================================
-- SEED DATA (Ensure Defaults)
-- ================================================================

INSERT INTO public.companies (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Company')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (email, password, role, company_id)
VALUES ('admin@company.com', 'admin123', 'admin', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (email) DO NOTHING;

-- Reload Schema Cache
NOTIFY pgrst, 'reload config';
