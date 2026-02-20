create extension if not exists "pgcrypto";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists biometric_devices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id),
  device_name text not null,
  device_type text not null check (device_type in ('ZKTeco', 'FingerTec')),
  ip_address text,
  port integer,
  serial_number text,
  device_token text,
  status text not null default 'active',
  last_sync_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id),
  full_name text not null,
  email text,
  biometric_id text,
  department_id uuid references departments(id),
  role text,
  salary numeric,
  hire_date date,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists raw_attendance_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id),
  device_id uuid not null references biometric_devices(id),
  biometric_user_id text not null,
  timestamp timestamptz not null,
  log_type text not null check (log_type in ('check_in', 'check_out')),
  created_at timestamptz not null default now()
);

create table if not exists attendance_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id),
  date date not null,
  check_in timestamptz,
  check_out timestamptz,
  total_hours numeric,
  late_minutes integer not null default 0,
  overtime_minutes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists payroll (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id),
  base_salary numeric,
  deductions numeric not null default 0,
  overtime_amount numeric not null default 0,
  net_salary numeric,
  month date not null,
  created_at timestamptz not null default now()
);

create table if not exists performance_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id),
  employee_id uuid not null references employees(id),
  score numeric,
  notes text,
  review_date date,
  created_at timestamptz not null default now()
);

create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id),
  employee_id uuid not null references employees(id),
  start_date date not null,
  end_date date not null,
  reason text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
