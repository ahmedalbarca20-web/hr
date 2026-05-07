import { SupabaseClient } from '@supabase/supabase-js';
export declare class TasksService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    findAll(companyId?: string, employeeId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    getStats(companyId?: string): Promise<{
        pending: number;
        in_progress: number;
        completed: number;
        total: number;
    }>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
