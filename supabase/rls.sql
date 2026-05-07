-- ========================================
-- Row Level Security Policies
-- ========================================

-- تفعيل RLS على جميع الجداول
alter table companies enable row level security;
alter table departments enable row level security;
alter table employees enable row level security;
alter table biometric_devices enable row level security;
alter table raw_attendance_logs enable row level security;
alter table attendance_records enable row level security;
alter table attendance enable row level security;
alter table payroll enable row level security;
alter table performance_reviews enable row level security;
alter table leave_requests enable row level security;
alter table company_settings enable row level security;
alter table company_subscriptions enable row level security;
alter table user_profiles enable row level security;

-- ========================================
-- دالة للحصول على company_id من المستخدم الحالي
-- ========================================
create or replace function auth.company_id()
returns uuid as $$
  select coalesce(
    (current_setting('request.jwt.claims', true)::json->>'company_id')::uuid,
    (auth.jwt()->>'company_id')::uuid
  );
$$ language sql stable;

-- ========================================
-- دالة للحصول على role من المستخدم الحالي
-- ========================================
create or replace function auth.user_role()
returns text as $$
  select coalesce(
    current_setting('request.jwt.claims', true)::json->>'role',
    auth.jwt()->>'role'
  );
$$ language sql stable;

-- ========================================
-- سياسات جدول الشركات
-- ========================================
create policy "Users can view their own company"
  on companies for select
  using (id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "Super admin can manage companies"
  on companies for all
  using (auth.user_role() = 'super_admin');

-- ========================================
-- سياسات جدول الأقسام
-- ========================================
create policy "Users can view departments in their company"
  on departments for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "HR can manage departments"
  on departments for all
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'hr_manager', 'admin')
  );

-- ========================================
-- سياسات جدول الموظفين
-- ========================================
create policy "Users can view employees in their company"
  on employees for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "HR can manage employees"
  on employees for all
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'hr_manager', 'admin')
  );

-- ========================================
-- سياسات أجهزة البصمة
-- ========================================
create policy "Users can view devices in their company"
  on biometric_devices for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "Admin can manage devices"
  on biometric_devices for all
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'admin')
  );

-- ========================================
-- سياسات سجلات الحضور الخام
-- ========================================
create policy "Users can view raw logs in their company"
  on raw_attendance_logs for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "System can insert raw logs"
  on raw_attendance_logs for insert
  with check (company_id = auth.company_id() or auth.user_role() = 'super_admin');

-- ========================================
-- سياسات سجلات الحضور
-- ========================================
create policy "Users can view attendance in their company"
  on attendance_records for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "HR can manage attendance"
  on attendance_records for all
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'hr_manager', 'admin')
  );

-- ========================================
-- سياسات جدول الحضور الرئيسي
-- ========================================
create policy "Users can view attendance in their company"
  on attendance for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "HR can manage attendance"
  on attendance for all
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'hr_manager', 'admin')
  );

-- ========================================
-- سياسات الرواتب
-- ========================================
create policy "Users can view their own payroll"
  on payroll for select
  using (
    company_id = auth.company_id() 
    or auth.user_role() in ('super_admin', 'hr_manager', 'admin', 'accountant')
  );

create policy "HR can manage payroll"
  on payroll for all
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'hr_manager', 'accountant')
  );

-- ========================================
-- سياسات تقييم الأداء
-- ========================================
create policy "Users can view performance reviews in their company"
  on performance_reviews for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "Managers can manage performance reviews"
  on performance_reviews for all
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'hr_manager', 'manager')
  );

-- ========================================
-- سياسات طلبات الإجازات
-- ========================================
create policy "Users can view leave requests in their company"
  on leave_requests for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "Employees can create their own leave requests"
  on leave_requests for insert
  with check (company_id = auth.company_id());

create policy "HR can manage leave requests"
  on leave_requests for update
  using (
    company_id = auth.company_id() 
    and auth.user_role() in ('super_admin', 'hr_manager', 'manager')
  );

create policy "Users can delete their pending requests"
  on leave_requests for delete
  using (
    company_id = auth.company_id() 
    and status = 'pending'
  );

-- ========================================
-- سياسات إعدادات الشركة
-- ========================================
create policy "Users can view company settings"
  on company_settings for select
  using (company_id = auth.company_id() or auth.user_role() = 'super_admin');

create policy "Company admin can update settings"
  on company_settings for update
  using (
    company_id = auth.company_id()
    and auth.user_role() in ('super_admin', 'company_admin')
  );

create policy "Company admin can insert settings"
  on company_settings for insert
  with check (
    company_id = auth.company_id()
    and auth.user_role() in ('super_admin', 'company_admin')
  );

-- ========================================
-- سياسات بروفايلات المستخدمين
-- ========================================
create policy "Users can view profiles"
  on user_profiles for select
  using (
    auth.user_role() = 'super_admin'
    or id = auth.uid()
    or company_id = auth.company_id()
  );

create policy "Admins can manage profiles"
  on user_profiles for all
  using (
    auth.user_role() = 'super_admin'
    or (
      company_id = auth.company_id()
      and auth.user_role() = 'company_admin'
    )
  );

-- ========================================
-- سياسات الاشتراكات
-- ========================================
create policy "Users can view subscriptions"
  on company_subscriptions for select
  using (
    auth.user_role() = 'super_admin'
    or company_id = auth.company_id()
  );

create policy "Super admin can manage subscriptions"
  on company_subscriptions for all
  using (auth.user_role() = 'super_admin');
