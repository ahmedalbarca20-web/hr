import { SupabaseClient } from '@supabase/supabase-js';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
export declare class EmployeesService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    private ensureActiveSubscription;
    list(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateEmployeeDto): Promise<any>;
    update(id: string, dto: UpdateEmployeeDto): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
