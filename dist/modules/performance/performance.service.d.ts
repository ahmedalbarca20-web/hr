import { SupabaseClient } from '@supabase/supabase-js';
export declare class PerformanceService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    create(createPerformanceDto: any): Promise<any>;
    findAll(employeeId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePerformanceDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
