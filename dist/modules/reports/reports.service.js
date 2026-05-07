"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let ReportsService = class ReportsService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getAttendanceReport(filters) {
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
        if (error)
            throw error;
        return data ?? [];
    }
    async getPayrollReport(filters) {
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
        if (error)
            throw error;
        return data ?? [];
    }
    async getLeaveReport(filters) {
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
        if (error)
            throw error;
        return data ?? [];
    }
    async getEmployeeReport(filters) {
        let query = this.supabase
            .from('employees')
            .select('*, departments(name), companies(name)')
            .eq('company_id', filters.companyId);
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        const { data, error } = await query.order('name');
        if (error)
            throw error;
        return data ?? [];
    }
    async getCompanyUsageReport(companyId) {
        const { data: subscription } = await this.supabase
            .from('company_subscriptions')
            .select('*')
            .eq('company_id', companyId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        const { count: employeeCount } = await this.supabase
            .from('employees')
            .select('*', { count: 'exact' })
            .eq('company_id', companyId);
        const { count: deviceCount } = await this.supabase
            .from('biometric_devices')
            .select('*', { count: 'exact' })
            .eq('company_id', companyId);
        const { count: attendanceCount } = await this.supabase
            .from('attendance')
            .select('*', { count: 'exact' })
            .eq('company_id', companyId);
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
                    percentage: (((employeeCount ?? 0) / (subscription?.max_employees ?? 1)) * 100).toFixed(1),
                },
                devices: {
                    used: deviceCount ?? 0,
                    limit: subscription?.max_devices ?? 0,
                    percentage: (((deviceCount ?? 0) / (subscription?.max_devices ?? 1)) * 100).toFixed(1),
                },
                records: {
                    attendance: attendanceCount ?? 0,
                    leave: leaveCount ?? 0,
                },
            },
        };
    }
    async generateDashboardSummary(companyId) {
        const currentDate = new Date();
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
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
        const { data: monthAttendance } = await this.supabase
            .from('attendance')
            .select('*')
            .eq('company_id', companyId)
            .gte('check_in', monthStart.toISOString());
        const { data: pendingLeaves } = await this.supabase
            .from('leave_requests')
            .select('*')
            .eq('company_id', companyId)
            .eq('status', 'pending');
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], ReportsService);
//# sourceMappingURL=reports.service.js.map