⚠️ حل مشكلة الملفات والصلاحيات الإدارية
====================================

## المشاكل المكتشفة:
1. ❌ قاعدة البيانات فارغة (seed.sql لم يتم تنفيذه)
2. ❌ جدول user_profiles غير موجود
3. ❌ لا توجد صلاحيات إدارية مختلفة للمستخدمين

## ✅ الحلول المطبقة:

### 1️⃣ جدول user_profiles تم إضافته
- ملف: `supabase/schema.sql` 
- يحتوي على:
  - user_id (ربط مع Supabase Auth)
  - role (super_admin, admin, hr_manager, employee)
  - company_id (الشركة المرتبطة)

### 2️⃣ بيانات المستخدمين الإدارية تم إضافتها
- ملف: `supabase/seed.sql`
- Super Admin: superadmin@hr-demo.local (و opsadmin@hr-demo.local) — انظر DEMO_CREDENTIALS.md
- HR Managers من كل شركة
- Admin لكل شركة

### 3️⃣ دوال الصلاحيات تم تحديثها
- ملف: `public/js/api.js`
- canAccessAdmin() - يتحقق من صلاحيات المسؤول
- showAdminFeatures() - يعرض الميزات الإدارية
- getUserRole() - يجلب الدور من localStorage

### 4️⃣ تسجيل الدخول تم تحديثه
- ملف: `public/login.html`
- يحفظ بيانات المستخدم في localStorage
- يوجه الـ super_admin إلى admin.html

## 🚀 خطوات التطبيق:

### الخطوة 1: إنشاء المستخدمين في Supabase
```
1. اذهب إلى: https://app.supabase.com → مشروعك
2. اختر: Authentication > Users
3. اضغط: Create new user

المستخدم الأول (Super Admin):
- Email: superadmin@hr-demo.local
- Password: انظر DEMO_CREDENTIALS.md

المستخدمان الآخران (HR):
- Email: hr.rafideen@hr-demo.local
- Email: hr.alnoor@hr-demo.local
```

### الخطوة 2: الحصول على User IDs
```
1. اذهب إلى: SQL Editor
2. شغل هذا الأمر:

SELECT id, email FROM auth.users 
WHERE email IN (
  'superadmin@hr-demo.local',
  'hr.rafideen@hr-demo.local', 
  'hr.alnoor@hr-demo.local',
  'admin.consult@hr-demo.local'
);

3. انسخ الـ UUID لكل مستخدم
```

### الخطوة 3: تحديث seed.sql بـ UUIDs الفعلية
```
في ملف: supabase/seed.sql

استبدل:
- '00000000-0000-0000-0000-100000000001' 
  مع UUID الـ Super Admin الفعلي

- '00000000-0000-0000-0000-100000000002'
  مع UUID الـ ahmad الفعلي

... وهكذا
```

### الخطوة 4: تنفيذ قاعدة البيانات
```
الطريقة الأولى (عبر Dashboard):
1. اذهب إلى SQL Editor
2. اختر ملفات:
   - supabase/schema.sql
   - supabase/rls.sql
   - supabase/seed.sql
3. اضغط Execute لكل ملف

الطريقة الثانية (عبر CLI):
npm run db:push
```

### الخطوة 5: التحقق من النتائج
```
في SQL Editor، شغل:

-- التحقق من المستخدمين
SELECT email, full_name, role, company_id FROM user_profiles;

-- التحقق من البيانات
SELECT COUNT(*) as total FROM employees;
SELECT COUNT(*) as total FROM attendance;
SELECT COUNT(*) as total FROM payroll;
```

## 📋 الأدوار وصلاحياتها:

### Super Admin
- ✅ وصول كامل لجميع الشركات
- ✅ إدارة المستخدمين والأدوار
- ✅ إدارة الاشتراكات
- ✅ إدارة الشركات
- ✅ لوحة تحكم خاصة (admin.html)

### Admin / HR Manager
- ✅ وصول لشركتهم فقط
- ✅ إدارة الموظفين والأقسام
- ✅ إدارة الحضور والرواتب
- ✅ التقارير الإدارية المتقدمة
- ✅ عرض إداري في الجداول

### Employee
- ✅ مشاهدة بيانات شخصية فقط
- ✅ تصفح التقارير العامة
- ✅ لا يمكنه التعديل أو الحذف

## ✔️ اختبار النظام:

### 1. تسجيل الدخول كـ Super Admin
```
Email: superadmin@hr-demo.local
Password: (من DEMO_CREDENTIALS.md)

يجب أن يعيد التوجيه إلى: admin.html
```

### 2. تسجيل الدخول كـ HR Manager
```
Email: hr.rafideen@hr-demo.local
Password: (من DEMO_CREDENTIALS.md)

يجب أن يعيد التوجيه إلى: dashboard.html
وأن يرى الميزات الإدارية (عرض إداري متقدم)
```

### 3. التحقق من الصلاحيات
```
1. اضغط على "عرض إداري" في صفحات:
   - payroll.html
   - attendance.html
   - employees.html

2. يجب أن تظهر الجداول والإحصائيات المتقدمة
3. التقارير يجب أن تظهر فقط بيانات الشركة
```

## 🔧 استكشاف الأخطاء:

### المشكلة: لا توجد ميزات إدارية
**الحل:**
1. تحقق من role في localStorage:
   ```
   console.log(JSON.parse(localStorage.getItem('user')));
   ```
2. تأكد أن البريد في user_profiles صحيح
3. تأكد أن البيانات في seed.sql محدثة

### المشكلة: تسجيل دخول فاشل
**الحل:**
1. تحقق من وجود المستخدم في Supabase Auth
2. تأكد من كلمة المرور كما في DEMO_CREDENTIALS.md
3. افحص console للأخطاء

### المشكلة: الجداول فارغة
**الحل:**
1. تأكد من تنفيذ seed.sql
2. افحص SQL Editor للأخطاء
3. تحقق من RLS Policies

## 📞 ملفات مهمة:
- SETUP_ADMIN_USERS.sql - خطوات الإعداد التفصيلية
- PUBLIC/login.html - صفحة تسجيل الدخول المحدثة
- PUBLIC/js/api.js - دوال الصلاحيات المحدثة
- SUPABASE/schema.sql - يحتوي على user_profiles
- SUPABASE/seed.sql - بيانات المستخدمين والموظفين

---
**تم التحديث:** 14 فبراير 2026
**الحالة:** جاهز للتفعيل
