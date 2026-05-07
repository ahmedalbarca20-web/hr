import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getAttendanceReport(companyId: string, startDate?: string, endDate?: string, employeeId?: string): Promise<any[]>;
    getPayrollReport(companyId: string, startDate?: string, endDate?: string, employeeId?: string): Promise<any[]>;
    getLeaveReport(companyId: string, startDate?: string, endDate?: string, employeeId?: string, status?: string): Promise<any[]>;
    getEmployeeReport(companyId: string, status?: string): Promise<any[]>;
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
    getDashboardSummary(companyId: string): Promise<{
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
