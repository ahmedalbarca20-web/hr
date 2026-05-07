import { SupabaseClient } from '@supabase/supabase-js';
export declare class JobsService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    create(createJobDto: any): Promise<any>;
    findAll(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateJobDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
