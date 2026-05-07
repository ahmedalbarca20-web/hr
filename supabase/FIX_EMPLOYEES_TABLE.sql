-- Add missing columns to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS role text,
ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8,
ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;

-- Refresh schema cache
NOTIFY pgrst, 'reload config';
