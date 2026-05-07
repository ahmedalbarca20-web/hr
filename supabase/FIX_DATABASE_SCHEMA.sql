-- =============================================
-- FIX MISSING TABLES: User Profiles & Subscriptions
-- Run this in Supabase SQL Editor to fix the "relation does not exist" error
-- =============================================

-- 1. Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id),
  role text NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'hr_manager', 'employee')),
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON user_profiles(company_id);

-- 2. Create company_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS company_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  plan_name text NOT NULL,
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  max_employees integer NOT NULL DEFAULT 0,
  max_devices integer NOT NULL DEFAULT 0,
  max_monthly_hours integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company ON company_subscriptions(company_id);

-- 3. Add columns to existing tables (just in case)
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8,
  ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;

ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS last_backup_at timestamptz,
  ADD COLUMN IF NOT EXISTS backup_acknowledged boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS backup_reminder_enabled boolean DEFAULT true;

-- 4. Enable RLS (Row Level Security) on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow admins/super admins to read all profiles
-- (Simplified policy for now)
CREATE POLICY "Admins can read all profiles" ON user_profiles
  FOR SELECT USING (
    exists (
      select 1 from user_profiles up 
      where up.id = auth.uid() 
      and up.role in ('super_admin', 'company_admin', 'hr_manager')
    )
  );
