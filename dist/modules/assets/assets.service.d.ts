import { SupabaseClient } from '@supabase/supabase-js';
export declare class AssetsService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    create(createAssetDto: any): Promise<any>;
    findAll(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateAssetDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
