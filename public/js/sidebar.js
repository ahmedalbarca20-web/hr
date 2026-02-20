// Sidebar Component
function renderSidebar(activePage = '') {
  const settings = JSON.parse(localStorage.getItem('hr_settings') || '{}');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEn = settings.language === 'en';
  const isSuper = user.role === 'super_admin';

  const labels = isEn ? {
    title: 'HR Pro',
    subtitle: 'Human Resource Management',
    mainMenu: 'Main Menu',
    dashboard: 'Dashboard',
    employees: 'Employees',
    departments: 'Departments',
    attendance: 'Attendance',
    finance: 'Finance',
    payroll: 'Payroll',
    leave: 'Leave',
    leaveBadge: '5',
    systemDevices: 'System & Devices',
    biometric: 'Biometric Devices',
    settings: 'Settings',
    administration: 'Administration',
    assets: 'Assets Management',
    companies: 'Companies',
    reports: 'Reports',
    logout: 'Logout'
  } : {
    title: 'HR Pro',
    subtitle: 'إدارة الموارد البشرية',
    mainMenu: 'القائمة الرئيسية',
    dashboard: 'لوحة التحكم',
    employees: 'الموظفين',
    departments: 'الأقسام',
    attendance: 'الحضور والانصراف',
    finance: 'الإدارة المالية',
    payroll: 'المرتبات',
    leave: 'الإجازات',
    leaveBadge: '5',
    systemDevices: 'الأجهزة والنظام',
    biometric: 'أجهزة البصمة',
    settings: 'الإعدادات',
    administration: 'الإدارة العليا',
    assets: 'إدارة العهد والممتلكات',
    recruitment: 'التوظيف',
    performance: 'تقييم الأداء',
    companies: 'إدارة الشركات',
    reports: 'التقارير الشاملة',
    logout: 'تسجيل الخروج'
  };

  // Overlay
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  // Menu Toggle Button
  let menuToggle = document.querySelector('.menu-toggle');
  if (!menuToggle) {
    menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.appendChild(menuToggle);
  }

  // Close Button (Mobile Only)
  const closeBtn = `
    <button class="sidebar-close" style="position: absolute; top: 20px; left: 20px; background: none; border: none; color: white; font-size: 20px; cursor: pointer; display: none;">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  const isEmployee = user.role === 'employee';

  let sidebarHTML = `
    ${closeBtn}
    <div class="sidebar-header">
      <div class="logo-icon"><i class="fa-solid fa-users"></i></div>
      <div class="logo-text">
        ${labels.title}
        <span>${labels.subtitle}</span>
      </div>
    </div>
    
    <div class="sidebar-content">
  `;

  if (isEmployee) {
    // ----------------------------------------------------------------
    // EMPLOYEE SIDEBAR
    // ----------------------------------------------------------------
    sidebarHTML += `
          <nav class="nav-section">
            <div class="nav-title">${isEn ? 'My Account' : 'حسابي'}</div>
            <ul class="nav-menu">
              <li><a href="/employee_dashboard.html" class="${activePage === 'employee_dashboard' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-house-user"></i></span> ${isEn ? 'My Dashboard' : 'لوحة الموظف'}</a></li>
              <li><a href="/settings.html" class="${activePage === 'settings' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-gear"></i></span> ${labels.settings}</a></li>
            </ul>
          </nav>
      `;
  } else {
    // ----------------------------------------------------------------
    // MANAGER / ADMIN SIDEBAR
    // ----------------------------------------------------------------
    sidebarHTML += `
      <nav class="nav-section">
        <div class="nav-title">${labels.mainMenu}</div>
        <ul class="nav-menu">
          <li><a href="/dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-chart-line"></i></span> ${labels.dashboard}</a></li>
          <li><a href="/tasks.html" class="${activePage === 'tasks' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-list-check"></i></span> ${isEn ? 'Tasks' : 'المهام'}</a></li>
          <li><a href="/employees.html" class="${activePage === 'employees' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-users"></i></span> ${labels.employees}</a></li>
          <li><a href="/departments.html" class="${activePage === 'departments' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-building"></i></span> ${labels.departments}</a></li>
          <li><a href="/attendance.html" class="${activePage === 'attendance' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-clock"></i></span> ${labels.attendance}</a></li>
        </ul>
      </nav>
      `;

    if (isSuper || user.role === 'admin' || user.role === 'hr_manager' || user.role === 'company_admin') {
      sidebarHTML += `
          <nav class="nav-section">
            <div class="nav-title">${labels.finance}</div>
            <ul class="nav-menu">
              <li><a href="/payroll.html" class="${activePage === 'payroll' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-wallet"></i></span> ${labels.payroll}</a></li>
              <li><a href="/leave.html" class="${activePage === 'leave' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-calendar-days"></i></span> ${labels.leave}</a></li>
            </ul>
          </nav>
        `;
    }

    if (isSuper) {
      sidebarHTML += `
          <nav class="nav-section">
            <div class="nav-title">${labels.administration}</div>
            <ul class="nav-menu">
              <li><a href="/admin.html" class="${activePage === 'admin' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-shield-halved"></i></span> ${labels.companies}</a></li>
              <li><a href="/managers.html" class="${activePage === 'managers' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-user-tie"></i></span> ${isEn ? 'Managers' : 'مدراء الشركات'}</a></li>
              <li><a href="/assets.html" class="${activePage === 'assets' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-boxes-stacked"></i></span> ${labels.assets}</a></li>
              <li><a href="/recruitment.html" class="${activePage === 'recruitment' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-briefcase"></i></span> ${labels.recruitment}</a></li>
              <li><a href="/performance.html" class="${activePage === 'performance' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-chart-line"></i></span> ${labels.performance}</a></li>
              <li><a href="/reports.html" class="${activePage === 'reports' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-chart-pie"></i></span> ${labels.reports}</a></li>
            </ul>
          </nav>
        `;
    }

    sidebarHTML += `
          <nav class="nav-section">
            <div class="nav-title">${labels.systemDevices}</div>
            <ul class="nav-menu">
              <li><a href="/devices.html" class="${activePage === 'devices' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-fingerprint"></i></span> ${labels.biometric}</a></li>
              <li><a href="/settings.html" class="${activePage === 'settings' ? 'active' : ''}"><span class="icon"><i class="fa-solid fa-gear"></i></span> ${labels.settings}</a></li>
            </ul>
          </nav>
      `;
  } // End of Not Employee

  sidebarHTML += `
    </div>

    <button class="logout-btn" onclick="logout()">
      <span><i class="fa-solid fa-right-from-bracket"></i></span> ${labels.logout}
    </button>
  `;

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.innerHTML = sidebarHTML;

    // Mobile functionality
    const closeButton = sidebar.querySelector('.sidebar-close');

    // Toggle functionality
    function toggleSidebar() {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');

      if (window.innerWidth <= 1024) {
        if (closeButton) closeButton.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
      }
    }

    menuToggle.onclick = toggleSidebar;
    overlay.onclick = toggleSidebar;
    if (closeButton) closeButton.onclick = toggleSidebar;
  }
}

// Logout function
function logout() {
  localStorage.removeItem('supabase_token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('supabase_token');
  window.location.href = '/';
}

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('supabase_token') || sessionStorage.getItem('supabase_token');
  if (!token) {
    window.location.replace('/');
    throw new Error('Not authenticated');
  }
  return token;
}

// Initialize sidebar on page load
document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  let page = path.split('/').pop().replace('.html', '');
  if (page === '' || page === 'index') page = 'dashboard';
  renderSidebar(page);
});

