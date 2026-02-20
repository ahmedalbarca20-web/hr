-- =============================================
-- HR Pro Enhanced Schema Migration
-- Adds missing columns and new tables
-- =============================================

-- === COMPANIES ===
ALTER TABLE companies ADD COLUMN IF NOT EXISTS name_en text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS tax_number text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS currency text DEFAULT 'SAR';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Riyadh';

-- === DEPARTMENTS ===
ALTER TABLE departments ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES employees(id);
ALTER TABLE departments ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- === EMPLOYEES ===
ALTER TABLE employees ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS national_id text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female'));
ALTER TABLE employees ADD COLUMN IF NOT EXISTS nationality text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_phone text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS contract_type text DEFAULT 'full_time' CHECK (contract_type IN ('full_time', 'part_time', 'contract', 'intern'));
ALTER TABLE employees ADD COLUMN IF NOT EXISTS contract_end_date date;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS iban text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS position text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id uuid;

-- === BIOMETRIC DEVICES ===
ALTER TABLE biometric_devices ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE biometric_devices ADD COLUMN IF NOT EXISTS model text;

-- === ATTENDANCE RECORDS ===
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id);
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS status text DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'leave', 'holiday'));
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS notes text;

-- === LEAVE REQUESTS ===
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS leave_type text DEFAULT 'annual' CHECK (leave_type IN ('annual', 'sick', 'personal', 'maternity', 'paternity', 'unpaid', 'emergency', 'other'));
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS days integer;
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES employees(id);
ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- === PAYROLL ===
ALTER TABLE payroll ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id);
ALTER TABLE payroll ADD COLUMN IF NOT EXISTS allowances numeric NOT NULL DEFAULT 0;
ALTER TABLE payroll ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled'));
ALTER TABLE payroll ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE payroll ADD COLUMN IF NOT EXISTS payment_date date;
ALTER TABLE payroll ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'bank_transfer';

-- === NEW: SHIFTS TABLE ===
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  grace_minutes integer DEFAULT 15,
  is_default boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- === NEW: EMPLOYEE DOCUMENTS ===
CREATE TABLE IF NOT EXISTS employee_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  employee_id uuid NOT NULL REFERENCES employees(id),
  document_type text NOT NULL,
  document_name text NOT NULL,
  file_url text,
  expiry_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- === NEW: ANNOUNCEMENTS ===
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  title text NOT NULL,
  content text,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_by uuid REFERENCES employees(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- === NEW: ACTIVITY LOG (Audit Trail) ===
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- === NEW: SETTINGS ===
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) UNIQUE,
  work_days jsonb DEFAULT '["Sun","Mon","Tue","Wed","Thu"]',
  work_hours_start time DEFAULT '08:00',
  work_hours_end time DEFAULT '17:00',
  late_threshold_minutes integer DEFAULT 15,
  overtime_rate numeric DEFAULT 1.5,
  annual_leave_days integer DEFAULT 21,
  sick_leave_days integer DEFAULT 30,
  currency text DEFAULT 'SAR',
  date_format text DEFAULT 'DD/MM/YYYY',
  logo_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- === INDEXES ===
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_company ON attendance_records(company_id);
CREATE INDEX IF NOT EXISTS idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_company ON leave_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month ON payroll(month);
CREATE INDEX IF NOT EXISTS idx_payroll_company ON payroll(company_id);
CREATE INDEX IF NOT EXISTS idx_raw_logs_company ON raw_attendance_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_raw_logs_timestamp ON raw_attendance_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_devices_company ON biometric_devices(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_company ON activity_log(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at);
