-- ⚠️ SETUP INSTRUCTIONS FOR ADMIN USERS
-- اتبع هذه الخطوات لإنشاء مستخدمين إداريين مع صلاحيات صحيحة

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
Email: admin@demo.com
Password: Demo@123456

USER 2 - Super Admin (Primary)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: ahmedalbarca20@gmail.com
Password: @Ahmed11889955
Disable Confirm Email: تفعيل (اختياري)

USER 2 - HR Manager (Rafideen)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: ahmad@rafideen.com
Password: Demo@123456
Confirm Password: Demo@123456

USER 3 - HR Manager (Al-Noor)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: yousif@alnoor.com
Password: Demo@123456
Confirm Password: Demo@123456

USER 4 - Admin (Consultancy)
▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
Email: raya@consultancy.com
Password: Demo@123456
Confirm Password: Demo@123456
*/

-- ====================================
-- 2️⃣ الحصول على User IDs
-- ====================================

-- بعد إنشاء المستخدمين:
-- 1. اذهب إلى SQL Editor في Supabase Dashboard
-- 2. شغل هذا الأمر للحصول على User IDs:

SELECT id, email FROM auth.users WHERE email IN (
  'admin@demo.com',
  'ahmad@rafideen.com', 
  'yousif@alnoor.com',
  'raya@consultancy.com'
) ORDER BY email;

-- سيظهر شيء مثل:
/*
id (UUID) | email
---------------------
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | admin@demo.com
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | ahmad@rafideen.com
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | raya@consultancy.com
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | yousif@alnoor.com
*/

-- ====================================
-- 3️⃣ تحديث هذا الملف بـ User IDs الفعلية
-- ====================================

-- استبدل قيم UUIDs المزيفة بالقيم الفعلية من الخطوة السابقة في seed.sql:
-- 
-- '00000000-0000-0000-0000-100000000001' ← استبدل مع Super Admin UUID
-- '00000000-0000-0000-0000-100000000002' ← استبدل مع ahmad UUID
-- '00000000-0000-0000-0000-100000000003' ← استبدل مع yousif UUID
-- '00000000-0000-0000-0000-100000000004' ← استبدل مع raya UUID

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

-- النتيجة المتوقعة:
/*
email | full_name | role | company
---------|------------|----------|-------------------
admin@demo.com | مدير النظام الرئيسي | super_admin | (null)
ahmad@rafideen.com | أحمد محمود | hr_manager | شركة الرافدين للتكنولوجيا
yousif@alnoor.com | يوسف محمد (مدير) | hr_manager | مصنع النور الصناعي
raya@consultancy.com | ريا محمود (مديرة) | admin | استشارات العراق المتقدمة
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
