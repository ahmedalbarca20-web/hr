import { SupabaseClient } from '@supabase/supabase-js';
export declare class CompaniesService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    list(): Promise<any[]>;
    getOne(id: string): Promise<any>;
    create(companyData: any): Promise<any>;
    update(id: string, updates: any): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    getStats(id: string): Promise<{
        employees: number;
        departments: number;
        devices: number;
        users: number;
    }>;
}
