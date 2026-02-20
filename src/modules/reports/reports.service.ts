import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

interface ReportFilter {
  companyId: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  status?: string;
  type?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async getAttendanceReport(filters: ReportFilter) {
    let query = this.supabase
      .from('attendance')
      .select('*, employees(name, employee_id), companies(name)')
      .eq('company_id', filters.companyId);

    if (filters.startDate) {
      query = query.gte('check_in', new Date(filters.startDate).toISOString());
    }
    if (filters.endDate) {
      query = query.lte('check_in', new Date(filters.endDate).toISOString());
    }
    if (filters.employeeId) {
      query = query.eq('employee_id', filters.employeeId);
    }

    const { data, error } = await query.order('check_in', { ascending: false });
    if (error) throw error;

    return data ?? [];
  }

  async getPayrollReport(filters: ReportFilter) {
    let query = this.supabase
      .from('payroll')
      .select('*, employees(name, employee_id, company_id)')
      .eq('employees.company_id', filters.companyId);

    if (filters.startDate) {
      query = query.gte('pay_date', new Date(filters.startDate).toISOString());
    }
    if (filters.endDate) {
      query = query.lte('pay_date', new Date(filters.endDate).toISOString());
    }
    if (filters.employeeId) {
      query = query.eq('employee_id', filters.employeeId);
    }

    const { data, error } = await query.order('pay_date', { ascending: false });
    if (error) throw error;

    return data ?? [];
  }

  async getLeaveReport(filters: ReportFilter) {
    let query = this.supabase
      .from('leave_requests')
      .select('*, employees(name, employee_id), companies(name)')
      .eq('company_id', filters.companyId);

    if (filters.startDate) {
      query = query.gte('start_date', new Date(filters.startDate).toISOString());
    }
    if (filters.endDate) {
      query = query.lte('end_date', new Date(filters.endDate).toISOString());
    }
    if (filters.employeeId) {
      query = query.eq('employee_id', filters.employeeId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('start_date', {
      ascending: false,
    });
    if (error) throw error;

    return data ?? [];
  }

  async getEmployeeReport(filters: ReportFilter) {
    let query = this.supabase
      .from('employees')
      .select('*, departments(name), companies(name)')
      .eq('company_id', filters.companyId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('name');
    if (error) throw error;

    return data ?? [];
  }

  async getCompanyUsageReport(companyId: string) {
    // Get subscription details
    const { data: subscription } = await this.supabase
      .from('company_subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get employee count
    const { count: employeeCount } = await this.supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    // Get device count
    const { count: deviceCount } = await this.supabase
      .from('biometric_devices')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    // Get total attendance records
    const { count: attendanceCount } = await this.supabase
      .from('attendance')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    // Get total leave requests
    const { count: leaveCount } = await this.supabase
      .from('leave_requests')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    return {
      subscription: subscription ?? null,
      usage: {
        employees: {
          used: employeeCount ?? 0,
          limit: subscription?.max_employees ?? 0,
          percentage:
            (((employeeCount ?? 0) / (subscription?.max_employees ?? 1)) * 100).toFixed(1),
        },
        devices: {
          used: deviceCount ?? 0,
          limit: subscription?.max_devices ?? 0,
          percentage:
            (((deviceCount ?? 0) / (subscription?.max_devices ?? 1)) * 100).toFixed(1),
        },
        records: {
          attendance: attendanceCount ?? 0,
          leave: leaveCount ?? 0,
        },
      },
    };
  }

  async generateDashboardSummary(companyId: string) {
    const currentDate = new Date();
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    // Today's attendance
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(currentDate);
    todayEnd.setHours(23, 59, 59, 999);

    const { data: todayAttendance } = await this.supabase
      .from('attendance')
      .select('*')
      .eq('company_id', companyId)
      .gte('check_in', today.toISOString())
      .lte('check_in', todayEnd.toISOString());

    // Month's attendance
    const { data: monthAttendance } = await this.supabase
      .from('attendance')
      .select('*')
      .eq('company_id', companyId)
      .gte('check_in', monthStart.toISOString());

    // Pending leaves
    const { data: pendingLeaves } = await this.supabase
      .from('leave_requests')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'pending');

    // Total employees
    const { count: totalEmployees } = await this.supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    return {
      todayAttendance: {
        count: (todayAttendance ?? []).length,
        total: totalEmployees ?? 0,
        percentage: totalEmployees
          ? (((todayAttendance ?? []).length / totalEmployees) * 100).toFixed(1)
          : 0,
      },
      monthAttendance: (monthAttendance ?? []).length,
      pendingLeaves: (pendingLeaves ?? []).length,
      totalEmployees: totalEmployees ?? 0,
    };
  }
}
