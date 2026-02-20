-- ==============================================================================
-- 📋 TASKS TABLE MIGRATION
-- Run this in Supabase SQL Editor to add Tasks features.
-- ==============================================================================

-- 1. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES public.employees(id), -- Points to an Employee ID
  assigned_by uuid REFERENCES public.user_profiles(id), -- Points to a User Profile ID (Manager)
  due_date date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Add Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_company ON public.tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON public.tasks(assigned_by);

-- 3. Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Open for now, user can refine later)
DROP POLICY IF EXISTS "Access All" ON public.tasks;
CREATE POLICY "Access All" ON public.tasks FOR ALL USING (true);

-- 5. Refresh Cache
NOTIFY pgrst, 'reload config';
