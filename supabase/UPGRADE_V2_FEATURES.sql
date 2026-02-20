-- ================================================================
-- HR PRO V2 - UPGRADE SCRIPT (STRICT MODE)
-- Features: Assets, Documents, Recruitment (ATS), Performance
-- ================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.employee_documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
    title text NOT NULL, 
    file_url text, 
    expiry_date date, 
    is_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid NOT NULL,
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

-- 2. Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

-- 3. DROP Existing Policies (To avoid "already exists" error)
DROP POLICY IF EXISTS "Assets Policy" ON public.assets;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.assets;

DROP POLICY IF EXISTS "Docs Policy" ON public.employee_documents;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.employee_documents;

DROP POLICY IF EXISTS "Jobs Policy" ON public.jobs;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.jobs;

DROP POLICY IF EXISTS "Candidates Policy" ON public.candidates;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.candidates;

DROP POLICY IF EXISTS "Performance Policy" ON public.performance_reviews;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.performance_reviews;

-- 4. Create New Policies (Using a distinct name to be safe)
CREATE POLICY "Assets Policy" ON public.assets FOR ALL USING (true);
CREATE POLICY "Docs Policy" ON public.employee_documents FOR ALL USING (true);
CREATE POLICY "Jobs Policy" ON public.jobs FOR ALL USING (true);
CREATE POLICY "Candidates Policy" ON public.candidates FOR ALL USING (true);
CREATE POLICY "Performance Policy" ON public.performance_reviews FOR ALL USING (true);

-- 5. Reload Cache
NOTIFY pgrst, 'reload config';
