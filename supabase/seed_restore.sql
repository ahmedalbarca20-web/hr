-- Restore Companies
INSERT INTO companies (id, name, name_en, email, phone, address, created_at) VALUES 
('10000000-0000-0000-0000-000000000001', 'شركة الرافدين للتكنولوجيا', 'Al-Rafideen Tech', 'info@rafideen.com', '+9647700000001', 'Baghdad, Al-Mansour', now()),
('10000000-0000-0000-0000-000000000002', 'مصنع النور الصناعي', 'Al-Noor Factory', 'info@alnoor.com', '+9647700000002', 'Basra, Industrial Zone', now()),
('10000000-0000-0000-0000-000000000003', 'استشارات العراق المتقدمة', 'Iraq Advanced Consultancy', 'info@consultancy.com', '+9647700000003', 'Erbil, Gulan St', now())
ON CONFLICT (id) DO NOTHING;

-- Departments for Rafideen (Company 1)
INSERT INTO departments (id, company_id, name, description) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'الموارد البشرية', 'Human Resources'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'تطوير البرمجيات', 'Software Development'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'الإدارة', 'Management')
ON CONFLICT (id) DO NOTHING;

-- Departments for Al-Noor (Company 2)
INSERT INTO departments (id, company_id, name, description) VALUES
('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 'الإنتاج', 'Production Line'),
('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'الجودة', 'Quality Control'),
('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', 'الصيانة', 'Maintenance')
ON CONFLICT (id) DO NOTHING;

-- Departments for Consultancy (Company 3)
INSERT INTO departments (id, company_id, name, description) VALUES
('20000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000003', 'الاستشارات', 'Consulting Services')
ON CONFLICT (id) DO NOTHING;

-- Employees for Rafideen
INSERT INTO employees (id, company_id, full_name, email, department_id, role, salary, hire_date, status) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'أحمد محمود', 'ahmad@rafideen.com', '20000000-0000-0000-0000-000000000001', 'hr_manager', 4000, '2025-01-01', 'active'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'فاطمة علي', 'fatima@rafideen.com', '20000000-0000-0000-0000-000000000001', 'employee', 3000, '2025-01-15', 'active'),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'علي حسن', 'ali@rafideen.com', '20000000-0000-0000-0000-000000000002', 'employee', 3500, '2025-02-01', 'active')
ON CONFLICT (id) DO NOTHING;

-- Employees for Al-Noor
INSERT INTO employees (id, company_id, full_name, email, department_id, role, salary, hire_date, status) VALUES
('30000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 'يوسف محمد', 'yousif@alnoor.com', '20000000-0000-0000-0000-000000000011', 'hr_manager', 2800, '2025-01-10', 'active'),
('30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', 'ليلى حميد', 'laila@alnoor.com', '20000000-0000-0000-0000-000000000011', 'employee', 2600, '2025-01-20', 'active')
ON CONFLICT (id) DO NOTHING;

-- Subscriptions
INSERT INTO company_subscriptions (id, company_id, plan_name, billing_period, start_date, end_date, max_employees, max_devices, max_monthly_hours, status) VALUES
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Premium', 'annual', '2025-01-01', '2026-01-01', 50, 10, 10000, 'active'),
('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Enterprise', 'annual', '2025-01-01', '2026-01-01', 100, 20, 20000, 'active'),
('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Business', 'monthly', '2025-02-01', '2025-03-01', 10, 2, 2000, 'active')
ON CONFLICT (id) DO NOTHING;
