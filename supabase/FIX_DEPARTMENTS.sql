-- =============================================
-- FIX: ADD MISSING DESCRIPTION COLUMN
-- Run this in Supabase SQL Editor
-- =============================================

ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS description text;

NOTIFY pgrst, 'reload config';
