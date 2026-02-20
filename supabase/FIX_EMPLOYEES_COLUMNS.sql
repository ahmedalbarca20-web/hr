-- =============================================
-- FIX: ADD MISSING COLUMNS TO EMPLOYEES
-- Run this in Supabase SQL Editor
-- =============================================

-- Add salary if missing
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS salary numeric;

-- Add hire_date if missing
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS hire_date date;

-- Add other potentially missing columns just in case
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS role text;

ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8;

ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;

ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS biometric_id text;

-- Refresh schema cache
NOTIFY pgrst, 'reload config';
