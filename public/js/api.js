// API Helper Functions
const API_BASE = '/api';

// Get auth token
function getAuthToken() {
  return localStorage.getItem('supabase_token') || sessionStorage.getItem('supabase_token');
}

// Common headers
function getHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Generic fetch helper (used across all pages)
async function fetchData(endpoint, method = 'GET', body = null) {
  try {
    const options = { method, headers: getHeaders() };
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (response.status === 401) {
      window.location.href = '/';
      return null;
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `خطأ: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Generic API fetch (Promise-based)
async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    console.error('API Error:', error);
    throw error;
  }
}

// CRUD Operations
const api = {
  // GET all
  getAll: (resource, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/${resource}${query ? `?${query}` : ''}`);
  },

  // GET one
  getOne: (resource, id) => {
    return apiFetch(`/${resource}/${id}`);
  },

  // POST create
  create: (resource, data) => {
    return apiFetch(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // PATCH update
  update: (resource, id, data) => {
    return apiFetch(`/${resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // DELETE
  delete: (resource, id) => {
    return apiFetch(`/${resource}/${id}`, {
      method: 'DELETE'
    });
  }
};

// Notification
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Show
  setTimeout(() => notification.classList.add('show'), 10);

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '-';
  const settings = getAppSettings();
  const locale = settings.language === 'en' ? 'en-US' : 'ar-IQ';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: settings.timezone || 'Asia/Baghdad'
  });
}

// Format time
function formatTime(dateString) {
  if (!dateString) return '-';
  const settings = getAppSettings();
  const locale = settings.language === 'en' ? 'en-US' : 'ar-IQ';
  const date = new Date(dateString);
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: settings.timezone || 'Asia/Baghdad'
  });
}

// Format currency
function formatCurrency(amount, currency) {
  const settings = getAppSettings();
  const cur = currency || settings.currency || 'IQD';
  const locale = settings.language === 'en' ? 'en-US' : 'ar-IQ';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur,
    maximumFractionDigits: cur === 'IQD' ? 0 : 2
  }).format(amount || 0);
}

// Get app settings from localStorage
function getAppSettings() {
  try {
    return JSON.parse(localStorage.getItem('hr_settings') || '{}');
  } catch { return {}; }
}

const TRANSLATIONS_EN = {
  'لوحة التحكم - HR Pro': 'Dashboard - HR Pro',
  'الموظفين - نظام الموارد البشرية': 'Employees - HR System',
  'الأقسام - HR Pro': 'Departments - HR Pro',
  'الحضور والانصراف - HR Pro': 'Attendance - HR Pro',
  'الإجازات - HR Pro': 'Leave - HR Pro',
  'المرتبات - HR Pro': 'Payroll - HR Pro',
  'أجهزة البصمة - HR Pro': 'Biometric Devices - HR Pro',
  'الإعدادات - HR Pro': 'Settings - HR Pro',
  'تسجيل الدخول': 'Sign In',
  'أدخل بياناتك للوصول إلى لوحة التحكم': 'Enter your details to access the dashboard',
  'البريد الإلكتروني': 'Email',
  'كلمة المرور': 'Password',
  'تذكرني': 'Remember me',
  'نسيت كلمة المرور؟': 'Forgot password?',
  'نظام الموارد البشرية': 'Human Resources System',
  'منصة متكاملة لإدارة الموظفين والحضور والرواتب': 'An integrated platform for managing employees, attendance, and payroll',
  'مع دعم أجهزة البصمة ZKTeco و FingerTec': 'With support for ZKTeco and FingerTec devices',
  'جاري التحقق...': 'Verifying...',
  'إدارة الموظفين': 'Employee Management',
  'عرض وإدارة جميع الموظفين': 'View and manage all employees',
  'إضافة موظف': 'Add Employee',
  'بحث عن موظف...': 'Search for an employee...',
  'جميع الحالات': 'All statuses',
  'جميع الأقسام': 'All departments',
  'الموظف': 'Employee',
  'القسم': 'Department',
  'الراتب': 'Salary',
  'تاريخ التعيين': 'Hire Date',
  'الحالة': 'Status',
  'الإجراءات': 'Actions',
  'جاري التحميل...': 'Loading...',
  'إضافة موظف جديد': 'Add New Employee',
  'الاسم الكامل *': 'Full Name *',
  'اختر القسم': 'Select department',
  'الراتب الأساسي': 'Base Salary',
  'رقم البصمة': 'Biometric ID',
  'الدور': 'Role',
  'مثال: محاسب، مهندس...': 'Example: Accountant, Engineer...',
  'إلغاء': 'Cancel',
  'حفظ': 'Save',
  'إدارة الأقسام': 'Department Management',
  'إدارة أقسام الشركة والهيكل التنظيمي': 'Manage company departments and org structure',
  'إضافة قسم': 'Add Department',
  'البحث في الأقسام...': 'Search departments...',
  'الوصف': 'Description',
  'المدير': 'Manager',
  'عدد الموظفين': 'Employees Count',
  'لا توجد أقسام': 'No departments',
  'إضافة قسم جديد': 'Add New Department',
  '-- اختر المدير --': '-- Select manager --',
  'وصف القسم ومسؤولياته...': 'Department description and responsibilities...',
  'الحضور والانصراف': 'Attendance',
  'متابعة سجلات الحضور والانصراف للموظفين': 'Track employee attendance records',
  'تسجيل يدوي': 'Manual Entry',
  'حاضر اليوم': 'Present Today',
  'غائب': 'Absent',
  'متأخر': 'Late',
  'في إجازة': 'On Leave',
  'البحث عن موظف...': 'Search for employee...',
  'التاريخ': 'Date',
  'وقت الحضور': 'Check-in Time',
  'وقت الانصراف': 'Check-out Time',
  'ساعات العمل': 'Work Hours',
  'تسجيل حضور يدوي': 'Manual Attendance',
  '-- اختر الموظف --': '-- Select employee --',
  'ملاحظات': 'Notes',
  'أي ملاحظات إضافية...': 'Any additional notes...',
  'إدارة الإجازات': 'Leave Management',
  'متابعة طلبات الإجازات والموافقات': 'Track leave requests and approvals',
  'طلب إجازة': 'Request Leave',
  'بانتظار الموافقة': 'Pending Approval',
  'موافق عليها': 'Approved',
  'مرفوضة': 'Rejected',
  'إجمالي الأيام': 'Total Days',
  'جميع الأنواع': 'All types',
  'سنوية': 'Annual',
  'مرضية': 'Sick',
  'طارئة': 'Emergency',
  'بدون راتب': 'Unpaid',
  'من': 'From',
  'إلى': 'To',
  'عدد الأيام': 'Days',
  'السبب': 'Reason',
  'طلب إجازة جديد': 'New Leave Request',
  'من تاريخ': 'From Date',
  'إلى تاريخ': 'To Date',
  'سبب طلب الإجازة...': 'Leave request reason...',
  'إدارة المرتبات': 'Payroll Management',
  'إدارة رواتب الموظفين والمستحقات المالية': 'Manage employee salaries and financial dues',
  'إضافة راتب': 'Add Payroll',
  'إجمالي المرتبات': 'Total Payroll',
  'تم صرفها': 'Paid',
  'قيد المعالجة': 'Processing',
  'متوسط الراتب': 'Average Salary',
  'جميع الأشهر': 'All months',
  'مصروف': 'Paid',
  'ملغي': 'Cancelled',
  'الشهر': 'Month',
  'البدلات': 'Allowances',
  'الخصومات': 'Deductions',
  'الصافي': 'Net',
  'أجهزة البصمة': 'Biometric Devices',
  'إدارة أجهزة البصمة ZKTeco و FingerTec': 'Manage ZKTeco and FingerTec devices',
  'إضافة جهاز': 'Add Device',
  'متصل': 'Online',
  'غير متصل': 'Offline',
  'إجمالي الأجهزة': 'Total Devices',
  'آخر مزامنة': 'Last Sync',
  'البحث عن جهاز...': 'Search for device...',
  'جميع الأنواع': 'All types',
  'جميع الحالات': 'All statuses',
  'مزامنة الكل': 'Sync All',
  'الجهاز': 'Device',
  'النوع': 'Type',
  'عنوان IP': 'IP Address',
  'المنفذ': 'Port',
  'الموقع': 'Location',
  'آخر اتصال': 'Last Contact',
  'إضافة جهاز جديد': 'Add New Device',
  'اسم الجهاز': 'Device Name',
  'نوع الجهاز': 'Device Type',
  'الرقم التسلسلي': 'Serial Number',
  'مثال: جهاز البوابة الرئيسية': 'Example: Main Gate Device',
  'مثال: المبنى الرئيسي - البوابة': 'Example: Main Building - Gate',
  'الإعدادات': 'Settings',
  'إعدادات النظام والتخصيص': 'System settings and customization',
  'إعدادات عامة': 'General Settings',
  'تخصيص الإعدادات العامة للنظام': 'Customize general system settings',
  'اللغة': 'Language',
  'اختر لغة واجهة النظام': 'Choose system language',
  'المنطقة الزمنية': 'Time Zone',
  'تحديد المنطقة الزمنية للنظام': 'Set system time zone',
  'تنسيق التاريخ': 'Date Format',
  'اختر تنسيق عرض التاريخ': 'Choose date format',
  'العملة': 'Currency',
  'اختر عملة النظام': 'Choose system currency',
  'الوضع الداكن': 'Dark Mode',
  'تفعيل الوضع الداكن للواجهة': 'Enable dark mode for the UI',
  'اللون الرئيسي': 'Primary Color',
  'اختر اللون الرئيسي للواجهة': 'Choose primary UI color',
  'حفظ التغييرات': 'Save Changes',
  'بيانات الشركة': 'Company Info',
  'إعدادات بيانات الشركة الأساسية': 'Company basic information',
  'اسم الشركة': 'Company Name',
  'رقم الهاتف': 'Phone Number',
  'السجل التجاري': 'Commercial Register',
  'العنوان': 'Address',
  'عنوان الشركة الكامل': 'Full company address',
  'إعدادات الحضور والانصراف': 'Attendance Settings',
  'تخصيص أوقات وقواعد الحضور': 'Customize attendance schedules and rules',
  'وقت بداية الدوام': 'Work Start Time',
  'الوقت الرسمي لبداية العمل': 'Official work start time',
  'وقت نهاية الدوام': 'Work End Time',
  'الوقت الرسمي لنهاية العمل': 'Official work end time',
  'فترة السماح للتأخير': 'Late Grace Period',
  'الدقائق المسموح بالتأخير فيها': 'Allowed late minutes',
  'دقيقة': 'Minutes',
  'احتساب الغياب تلقائياً': 'Auto Mark Absence',
  'احتساب الموظفين غير المسجلين كغائبين': 'Mark unlogged employees as absent',
  'مزامنة تلقائية مع الأجهزة': 'Auto Sync with Devices',
  'مزامنة البيانات من أجهزة البصمة تلقائياً': 'Auto sync biometric data',
  'إعدادات الإشعارات': 'Notification Settings',
  'تخصيص إشعارات النظام': 'Customize system notifications',
  'إشعارات البريد الإلكتروني': 'Email Notifications',
  'استلام إشعارات عبر البريد': 'Receive email notifications',
  'إشعارات طلبات الإجازة': 'Leave Request Notifications',
  'إشعار عند تقديم طلب إجازة جديد': 'Notify on new leave request',
  'إشعارات التأخير': 'Late Notifications',
  'إشعار عند تأخر موظف': 'Notify when an employee is late',
  'تقارير يومية': 'Daily Reports',
  'إرسال ملخص يومي للحضور': 'Send daily attendance summary',
  'إعدادات الأمان': 'Security Settings',
  'إعدادات الأمان وحماية الحساب': 'Security and account protection',
  'المصادقة الثنائية': 'Two-factor Authentication',
  'تفعيل طبقة أمان إضافية': 'Enable extra security layer',
  'تسجيل الخروج التلقائي': 'Auto Logout',
  'تسجيل الخروج بعد فترة من عدم النشاط': 'Logout after inactivity',
  'تغيير كلمة المرور': 'Change Password',
  'كلمة المرور الحالية': 'Current Password',
  'كلمة المرور الجديدة': 'New Password',
  'تأكيد كلمة المرور': 'Confirm Password',
  'تم حفظ الإعدادات بنجاح': 'Settings saved successfully',
  'حدث خطأ في تحميل البيانات': 'Error loading data',
  'لا يوجد موظفين': 'No employees',
  'عرض الكل': 'View All',
  'آخر الأنشطة': 'Latest Activity',
  'أحدث الموظفين': 'Newest Employees',
  'ملخص الإجازات': 'Leave Summary',
  'إدارة': 'Manage',
  'توزيع الأقسام': 'Department Distribution',
  'ملخص المرتبات': 'Payroll Summary',
  'التفاصيل': 'Details',
  'معلّق': 'Pending',
  'تم الدفع': 'Paid',
  'حاضرون اليوم': 'Present Today',
  'متأخرون': 'Late',
  'إجراءات سريعة': 'Quick Actions',
  'تسجيل حضور': 'Record Attendance',
  'طلب إجازة': 'Leave Request',
  'أجهزة البصمة': 'Biometric Devices',
  'الحضور الأسبوعي': 'Weekly Attendance',
  'هذا الأسبوع': 'This Week',
  'هذا الشهر': 'This Month',
  'من 100': 'Out of 100',
  'نسبة الحضور': 'Attendance Rate',
  'الاستقرار': 'Retention',
  'الرضا': 'Satisfaction',
  'الأحد': 'Sunday',
  'الاثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الخميس': 'Thursday',
  'الجمعة': 'Friday',
  'السبت': 'Saturday',
  'لا يوجد': 'None',
  'نشط': 'Active',
  'غير نشط': 'Inactive',
  'حاضر': 'Present',
  'غائب': 'Absent',
  'متأخر': 'Late',
  'معلق': 'Pending',
  'شخص': 'person',
  'طلبات معلقة': 'Pending Requests',
  'طلبات مقبولة': 'Approved Requests',
  'لا توجد أنشطة حديثة': 'No recent activities',
  'ابدأ بإضافة موظفين': 'Start by adding employees',
  'تم إضافة الموظف': 'Added employee',
  'تمت الموافقة على إجازة': 'Leave approved',
  'تم رفض إجازة': 'Leave rejected',
  'مؤخراً': 'Recently',
  'بدون قسم': 'No department',
  'شخصية': 'Personal',
  'موظف': 'Employee',
  'أجهزة مفعلة': 'Active Devices',
  'دقيقة': 'min',
  'غير محدد': 'Not set'
};

const PLACEHOLDER_TRANSLATIONS_EN = {
  'example@company.com': 'example@company.com',
  '••••••••': '••••••••'
};

function translateString(value) {
  if (!value) return value;
  const settings = getAppSettings();
  if (settings.language !== 'en') return value;

  let result = value;
  const keys = Object.keys(TRANSLATIONS_EN).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    result = result.split(key).join(TRANSLATIONS_EN[key]);
  }
  return result;
}

function applyTranslations(root = document.body) {
  const settings = getAppSettings();
  if (settings.language !== 'en') return;

  document.title = translateString(document.title);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let current = walker.nextNode();
  while (current) {
    const original = current.nodeValue;
    const trimmed = original.trim();
    const translated = translateString(trimmed);
    if (translated !== trimmed) {
      current.nodeValue = original.replace(trimmed, translated);
    }
    current = walker.nextNode();
  }

  root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
    const ph = el.getAttribute('placeholder') || '';
    const translated = PLACEHOLDER_TRANSLATIONS_EN[ph] || translateString(ph);
    if (translated && translated !== ph) {
      el.setAttribute('placeholder', translated);
    }
  });
}

let translationObserver;
function observeTranslations() {
  const settings = getAppSettings();
  if (settings.language !== 'en' || translationObserver) return;
  translationObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue || '';
            const translated = translateString(text);
            if (translated !== text) {
              node.nodeValue = translated;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            applyTranslations(node);
          }
        });
      } else if (m.type === 'characterData' && m.target?.nodeValue) {
        const original = m.target.nodeValue;
        const translated = translateString(original);
        if (translated !== original) {
          m.target.nodeValue = translated;
        }
      }
    }
  });

  translationObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
}

// Apply global settings (color, dark mode, language direction)
function applyGlobalSettings() {
  const settings = getAppSettings();

  // Primary color
  if (settings.primaryColor) {
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    // Also update primary-dark
    document.documentElement.style.setProperty('--primary-dark', settings.primaryColor);
  }

  // Dark mode
  if (settings.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Language direction
  if (settings.language === 'en') {
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  } else {
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
  }
}

// Apply settings on every page load
document.addEventListener('DOMContentLoaded', () => {
  applyGlobalSettings();
  applyTranslations();
  observeTranslations();
});

// Random color for avatars
function getAvatarColor(name) {
  const colors = [
    '#0ea5e9', '#8b5cf6', '#06b6d4', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#3b82f6'
  ];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
}

// Get initials from name
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Modal helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

// Export helper (CSV compatible with Excel)
function exportTableToCsv(filename, tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tr'));
  const csv = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map((cell) => {
      const text = (cell.innerText || '').replace(/\s+/g, ' ').trim();
      const escaped = text.replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',');
  }).join('\n');

  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// JWT and Authorization Utilities
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

function ensureUserFromToken() {
  const token = getAuthToken();
  if (!token) return null;

  const decoded = decodeJWT(token) || {};
  const stored = JSON.parse(localStorage.getItem('user') || '{}');

  let role = stored?.role || decoded?.user_metadata?.role || decoded?.role || decoded?.app_metadata?.role || 'employee';
  const roleMap = {
    super_admin: 'super_admin',
    admin: 'admin',
    hr_manager: 'hr_manager',
    company_admin: 'admin',
    employee: 'employee'
  };
  role = roleMap[role] || 'employee';

  const email = stored?.email || decoded?.email || decoded?.user_metadata?.email || '';
  if (!decoded?.user_metadata?.role && ((email || '').toLowerCase() === 'admin@demo.com' || (email || '').toLowerCase() === 'ahmedalbarca20@gmail.com')) {
    role = 'super_admin';
  }

  const user = {
    id: stored?.id || decoded?.sub || null,
    email,
    role,
    company_id: role === 'super_admin' ? null : (stored?.company_id || decoded?.user_metadata?.company_id || null),
    full_name: stored?.full_name || decoded?.user_metadata?.full_name || email
  };

  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

function getUserRole() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.role) return user.role;
  const ensured = ensureUserFromToken();
  return ensured?.role || null;
}

function getUserId() {
  const token = getAuthToken();
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded?.sub || null;
}

function getCompanyId() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.company_id) return user.company_id;
  const ensured = ensureUserFromToken();
  return ensured?.company_id || null;
}

function isSuperAdmin() {
  return getUserRole() === 'super_admin';
}

function isCompanyAdmin() {
  return getUserRole() === 'admin' || getUserRole() === 'company_admin';
}

function isHRManager() {
  return getUserRole() === 'hr_manager';
}

function isEmployee() {
  return getUserRole() === 'employee';
}

function canAccessAdmin() {
  const role = getUserRole();
  return role === 'super_admin' || role === 'admin' || role === 'hr_manager' || role === 'company_admin';
}

function showAdminFeatures() {
  if (canAccessAdmin()) {
    document.querySelectorAll('[data-admin-only]').forEach(el => {
      el.style.display = '';
    });
  } else {
    document.querySelectorAll('[data-admin-only]').forEach(el => {
      el.style.display = 'none';
    });
  }
}

function requireSuperAdmin() {
  if (!isSuperAdmin()) {
    alert('هذه الميزة متاحة فقط للمسؤول الأعلى');
    window.location.href = '/';
    return false;
  }
  return true;
}

function requireCompanyAdmin() {
  const role = getUserRole();
  if (role !== 'super_admin' && role !== 'company_admin' && role !== 'admin') {
    alert('هذه الميزة متاحة فقط لمسؤول الشركة والمسؤول الأعلى');
    window.location.href = '/dashboard.html';
    return false;
  }
  return true;
}

// Initialize admin features on page load
document.addEventListener('DOMContentLoaded', () => {
  showAdminFeatures();

  // Check authorization for admin page
  const adminPages = ['admin.html', 'reports.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (adminPages.includes(currentPage)) {
    const page = currentPage === 'admin.html'
      ? 'لوحة السوبر أدمن'
      : 'صفحة التقارير';

    if (!requireCompanyAdmin()) {
      console.warn(`Access denied to ${page}`);
    }
  }
}, { once: true });

