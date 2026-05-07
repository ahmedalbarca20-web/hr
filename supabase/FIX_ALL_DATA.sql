-- 1. Ensure Company Exists (to avoid Foreign Key errors)
INSERT INTO public.companies (id, name, name_en, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'الشركة الرئيسية', 
  'Main Company', 
  now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Active Subscription (Fixes "Subscription inactive" error)
INSERT INTO public.company_subscriptions (
  company_id, 
  plan_name, 
  billing_period, 
  start_date, 
  end_date, 
  max_employees, 
  max_devices, 
  max_monthly_hours, 
  status
) VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Unlimited Plan', 
  'annual', 
  '2024-01-01', 
  '2030-12-31', 
  1000, 
  100, 
  100000, 
  'active'
) ON CONFLICT DO NOTHING;

-- Note: If insertion fails because ID is auto-generated and we didn't specify it, 
-- we rely on the fact that we just want *any* active subscription for this company.
-- The above INSERT works if constraints allow.

-- 3. Add Missing Columns to Employees (Fixes "column role does not exist" error)
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS role text,
ADD COLUMN IF NOT EXISTS work_hours_per_day numeric DEFAULT 8,
ADD COLUMN IF NOT EXISTS work_hours_per_week numeric DEFAULT 40;

-- 4. Refresh Schema Cache
NOTIFY pgrst, 'reload config';
