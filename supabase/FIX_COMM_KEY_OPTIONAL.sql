-- =============================================
-- FIX: MAKE COMM_KEY OPTIONAL
-- Run this in Supabase SQL Editor
-- =============================================

-- Change comm_key to be nullable and default to '0'
ALTER TABLE public.biometric_devices 
ALTER COLUMN comm_key DROP NOT NULL;

ALTER TABLE public.biometric_devices 
ALTER COLUMN comm_key SET DEFAULT '0';

-- Refresh schema cache
NOTIFY pgrst, 'reload config';
