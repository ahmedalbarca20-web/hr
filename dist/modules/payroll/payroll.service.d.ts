import { SupabaseClient } from '@supabase/supabase-js';
import { CreatePayrollDto, UpdatePayrollDto } from './payroll.dto';
export declare class PayrollService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    list(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByEmployee(employeeId: string): Promise<any[]>;
    create(dto: CreatePayrollDto): Promise<any>;
    update(id: string, dto: UpdatePayrollDto): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    generateMonthlyPayroll(month: string): Promise<{
        generated: number;
        error?: undefined;
    } | {
        generated: number;
        error: import("@supabase/postgrest-js").PostgrestError | null;
    }>;
}
