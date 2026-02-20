-- =============================================
-- Multi-tenant subscriptions, profiles, work hours
-- =============================================

-- Employees: per-employee work hours
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8,
  ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;

-- Company settings: backup reminder metadata
ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS last_backup_at timestamptz,
  ADD COLUMN IF NOT EXISTS backup_acknowledged boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS backup_reminder_enabled boolean DEFAULT true;

-- User profiles linked to auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id),
  role text NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'employee')),
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON user_profiles(company_id);

-- Company subscriptions and limits
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
