-- =============================================
-- FIX: ADD MISSING COLUMNS TO BIOMETRIC_DEVICES
-- Run this in Supabase SQL Editor to fix "Could not find column" errors
-- =============================================

-- 1. Add 'location' column
ALTER TABLE public.biometric_devices 
ADD COLUMN IF NOT EXISTS location text;

-- 2. Add 'notes' column
ALTER TABLE public.biometric_devices 
ADD COLUMN IF NOT EXISTS notes text;

-- 3. Add 'comm_key' column (if not already added)
ALTER TABLE public.biometric_devices 
ADD COLUMN IF NOT EXISTS comm_key text DEFAULT '0';

-- 4. Add 'firmware_version' column
ALTER TABLE public.biometric_devices 
ADD COLUMN IF NOT EXISTS firmware_version text;

-- 5. Add 'last_activity' column (useful for tracking)
ALTER TABLE public.biometric_devices 
ADD COLUMN IF NOT EXISTS last_activity timestamptz;

-- Refresh schema cache to apply changes immediately
NOTIFY pgrst, 'reload config';
