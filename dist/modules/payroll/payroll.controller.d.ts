import { PayrollService } from './payroll.service';
import { CreatePayrollDto, UpdatePayrollDto } from './payroll.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    listPayroll(): Promise<any[]>;
    getPayroll(id: string): Promise<any>;
    getEmployeePayroll(employeeId: string): Promise<any[]>;
    createPayroll(dto: CreatePayrollDto): Promise<any>;
    generatePayroll(month: string): Promise<{
        generated: number;
        error?: undefined;
    } | {
        generated: number;
        error: import("@supabase/postgrest-js").PostgrestError | null;
    }>;
    updatePayroll(id: string, dto: UpdatePayrollDto): Promise<any>;
    deletePayroll(id: string): Promise<{
        success: boolean;
    }>;
}
