-- =============================================
-- FIX: ADD MISSING MANAGER_ID COLUMN
-- Run this in Supabase SQL Editor
-- =============================================

ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES public.employees(id);

-- Also ensure status column exists while we are at it
ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

NOTIFY pgrst, 'reload config';
