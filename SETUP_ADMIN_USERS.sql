-- ⚠️ SETUP INSTRUCTIONS FOR ADMIN USERS
-- اتبع هذه الخطوات لإنشاء مستخدمين إداريين مع صلاحيات صحيحة
-- كلمات المرور الموحدة: راجع DEMO_CREDENTIALS.md

-- ====================================
-- 1️⃣ إنشاء المستخدمين في Supabase Auth
-- ====================================

-- اذهب إلى: https://app.supabase.com
-- 1. اختر مشروعك
-- 2. اذهب إلى Authentication > Users
-- 3. اضغط "Create new user"

-- ثم أنشئ المستخدمين التالية:

/*
USER 1 - Super Admin (System)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: superadmin@hr-demo.local
Password: LocalHr#2026!Alpha

USER 2 - Super Admin (Operations)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: opsadmin@hr-demo.local
Password: LocalHr#2026!Bravo
Disable Confirm Email: تفعيل (اختياري)

USER 3 - HR Manager (Rafideen)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: hr.rafideen@hr-demo.local
Password: LocalHr#2026!Delta

USER 4 - HR Manager (Al-Noor)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: hr.alnoor@hr-demo.local
Password: LocalHr#2026!Echo

USER 5 - Admin (Consultancy)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: admin.consult@hr-demo.local
Password: LocalHr#2026!Foxtrot
*/

-- ====================================
-- 2️⃣ الحصول على User IDs
-- ====================================

-- بعد إنشاء المستخدمين:
-- 1. اذهب إلى SQL Editor في Supabase Dashboard
-- 2. شغل هذا الأمر للحصول على User IDs:

SELECT id, email FROM auth.users WHERE email IN (
  'superadmin@hr-demo.local',
  'hr.rafideen@hr-demo.local', 
  'hr.alnoor@hr-demo.local',
  'admin.consult@hr-demo.local'
) ORDER BY email;

-- سيظهر شيء مثل:
/*
id (UUID) | email
---------------------
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | admin.consult@hr-demo.local
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | hr.alnoor@hr-demo.local
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | hr.rafideen@hr-demo.local
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | superadmin@hr-demo.local
*/

-- ====================================
-- 3️⃣ تحديث هذا الملف بـ User IDs الفعلية
-- ====================================

-- استبدل قيم UUIDs المزيفة بالقيم الفعلية من الخطوة السابقة في seed.sql:
-- 
-- '00000000-0000-0000-0000-100000000001' ← استبدل مع Super Admin UUID
-- '00000000-0000-0000-0000-100000000002' ← استبدل مع hr.rafideen UUID
-- '00000000-0000-0000-0000-100000000003' ← استبدل مع hr.alnoor UUID
-- '00000000-0000-0000-0000-100000000004' ← استبدل مع admin.consult UUID

-- ====================================
-- 4️⃣ تشغيل Seed Data
-- ====================================

-- 1. اذهب إلى SQL Editor
-- 2. اختر ملف supabase/seed.sql
-- 3. اضغط "Execute"

-- أو شغل هذا الأمر:
-- npx supabase db push

-- ====================================
-- 5️⃣ التحقق من البيانات
-- ====================================

-- تحقق من أن البيانات تم إدخالها بنجاح:

SELECT 
  up.email,
  up.full_name,
  up.role,
  c.name as company
FROM user_profiles up
LEFT JOIN companies c ON up.company_id = c.id
ORDER BY up.role DESC, up.email;

-- النتيجة المتوقعة (مثال):
/*
email | full_name | role | company
---------|------------|----------|-------------------
superadmin@hr-demo.local | مدير النظام الرئيسي | super_admin | (null)
hr.rafideen@hr-demo.local | أحمد محمود | hr_manager | شركة الرافدين للتكنولوجيا
hr.alnoor@hr-demo.local | يوسف محمد (مدير) | hr_manager | مصنع النور الصناعي
admin.consult@hr-demo.local | ريا محمود (مديرة) | admin | استشارات العراق المتقدمة
*/

-- ====================================
-- 6️⃣ اختبار تسجيل الدخول
-- ====================================

-- 1. اذهب إلى login.html
-- 2. استخدم أحد بيانات الدخول أعلاه
-- 3. يجب أن ترى الآن صلاحيات إدارية مختلفة بناءً على الدور

-- ====================================
-- 📋 ملخص الأدوار
-- ====================================

/*
super_admin
  - وصول كامل لجميع الشركات والبيانات
  - إدارة المستخدمين والصلاحيات
  - إدارة الاشتراكات والخطط

hr_manager
  - وصول لشركته فقط
  - إدارة الموظفين والأقسام
  - إدارة الحضور والرواتب
  - التقارير الإدارية

admin
  - وصول لشركته فقط
  - نفس صلاحيات HR Manager
  - إدارة إضافية لإعدادات الشركة

employee
  - مشاهدة بيانات شخصية فقط
  - تصفح التقارير العامة
*/
