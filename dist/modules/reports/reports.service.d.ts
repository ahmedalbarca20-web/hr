import { SupabaseClient } from '@supabase/supabase-js';
interface ReportFilter {
    companyId: string;
    startDate?: string;
    endDate?: string;
    employeeId?: string;
    status?: string;
    type?: string;
}
export declare class ReportsService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    getAttendanceReport(filters: ReportFilter): Promise<any[]>;
    getPayrollReport(filters: ReportFilter): Promise<any[]>;
    getLeaveReport(filters: ReportFilter): Promise<any[]>;
    getEmployeeReport(filters: ReportFilter): Promise<any[]>;
    getCompanyUsageReport(companyId: string): Promise<{
        subscription: any;
        usage: {
            employees: {
                used: number;
                limit: any;
                percentage: string;
            };
            devices: {
                used: number;
                limit: any;
                percentage: string;
            };
            records: {
                attendance: number;
                leave: number;
            };
        };
    }>;
    generateDashboardSummary(companyId: string): Promise<{
        todayAttendance: {
            count: number;
            total: number;
            percentage: string | number;
        };
        monthAttendance: number;
        pendingLeaves: number;
        totalEmployees: number;
    }>;
}
export {};
