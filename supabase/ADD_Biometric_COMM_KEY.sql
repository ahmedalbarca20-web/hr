-- =============================================
-- FIX: ADD COMM_KEY TO BIOMETRIC DEVICES
-- Run this in Supabase SQL Editor
-- =============================================

ALTER TABLE public.biometric_devices 
ADD COLUMN IF NOT EXISTS comm_key text DEFAULT '0';

ALTER TABLE public.biometric_devices 
ADD COLUMN IF NOT EXISTS firmware_version text;

-- Refresh schema cache
NOTIFY pgrst, 'reload config';
