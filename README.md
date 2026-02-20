# Enterprise HR SaaS Backend

## Overview
This project provides a NestJS backend for a multi-tenant HR SaaS with biometric device integration (ZKTeco and FingerTec).

## Requirements
- Node.js 20+
- npm
- Supabase project with PostgreSQL and RLS enabled

## Setup
1) Copy .env.example to .env and set required values.
2) Install dependencies:
   - npm install
3) Apply schema and RLS policies:
   - Run the SQL in supabase/schema.sql
   - Run the SQL in supabase/rls.sql
4) Optional seed data:
   - Run the SQL in supabase/seed.sql

## Run
- Development: npm run start:dev
- Production: npm run build then npm run start:prod

## مواصفات العمل للشركات (Multi-tenant)
هذا المشروع يعتمد عزل البيانات لكل شركة باستخدام company_id وسياسات RLS، بحيث لا تختلط بيانات الشركات.

### الادوار والبروفايلات
- سوبر ادمن: يشاهد كل الشركات والبروفايلات.
- مدير شركة (company_admin): يشاهد ويعدل بيانات شركته فقط.
- موظف: صلاحياته داخل شركته فقط.

تمت اضافة جدول user_profiles المرتبط بـ auth.users للاحتفاظ بالدور والبروفايل لكل مستخدم.

### العقود والحدود
تمت اضافة جدول company_subscriptions ويحتوي:
- مدة الاشتراك (شهري/سنوي) بتاريخ بداية ونهاية.
- حدود عدد الموظفين والاجهزة وساعات العمل الشهرية.

النظام يمنع اضافة موظفين او اجهزة جديدة اذا انتهت مدة الاشتراك او تم تجاوز الحد حسب العقد.

### ساعات العمل لكل موظف
تمت اضافة حقول ساعات العمل اليومية والاسبوعية داخل بروفايل الموظف:
- work_hours_per_day
- work_hours_per_week

### النسخ الاحتياطي
تمت اضافة حقول في company_settings لتذكير الشركات بالنسخ الاحتياطي:
- last_backup_at
- backup_acknowledged
- backup_reminder_enabled

**تنبيه قانوني:** الشركة مسؤولة عن النسخ الاحتياطي لبياناتها، ونحن غير مسؤولين عن فقدان البيانات في حال عدم تنفيذ النسخ الاحتياطي.

### التصدير الى اكسل
تمت اضافة زر "تصدير اكسل" في صفحات الحضور والرواتب لتصدير جدول البيانات الحالي بصيغة CSV متوافقة مع Excel.

### بيانات تجريبية
تمت اضافة شركات وموظفين واجهزة تجريبية في ملف seed.sql للفحص والتجربة.

## ملاحظة مهمة: مشكلة اللغة الانجليزية في الواجهة
عند تحويل اللغة إلى الانجليزية كانت الصفحات تتجمد أو تتوقف عن الاستجابة. السبب كان في مراقب الترجمة (MutationObserver) الموجود في ملف الواجهة [public/js/api.js](public/js/api.js). هذا المراقب كان يعيد تعيين نصوص DOM حتى عندما لا تتغير فعليا، مما يسبب سلسلة تحديثات متكررة (loop) تؤدي إلى تعليق الصفحة.

### سبب المشكلة
- الترجمة كانت تعمل على أي تغيير نصي داخل الصفحة.
- في كل تغيير، يتم تعيين النص من جديد حتى لو لم يتغير، فينتج عنها سلسلة تحديثات متكررة لا تتوقف.

### الحل الذي تم تطبيقه
- إضافة تحقق بسيط: لا يتم تحديث النص إلا إذا كانت الترجمة مختلفة عن النص الاصلي.
- هذا يمنع الحلقة المتكررة ويعيد استقرار الصفحات عند التحويل للغة الانجليزية.

## Biometric Testing Notes
- ZKTeco: configure device IP, port 4370, and register device in biometric_devices.
- FingerTec: register device_token in biometric_devices and post webhook payloads to /api/biometric/fingertic/webhook with header x-device-token.

## Project Structure
- src/modules contains feature modules, biometric integration, guards, and database access.
- supabase contains SQL schema and RLS policies.
- supabase/migrations contains migration scripts.

## Device Sync
- Background sync uses DEVICE_SYNC_CRON for ZKTeco devices.
- Raw logs are stored in raw_attendance_logs before processing.

## Next Steps
- Implement full ZKTeco protocol commands in zkteco.service.ts and zkteco.parser.ts.
- Extend attendance processing to handle shifts, late rules, and overtime logic.
