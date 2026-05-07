import { SupabaseClient } from '@supabase/supabase-js';
export declare class CandidatesService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    create(dto: any): Promise<any>;
    findAll(jobId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    hire(id: string, company_id: string): Promise<any>;
}
