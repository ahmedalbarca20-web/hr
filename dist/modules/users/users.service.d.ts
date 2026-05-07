import { SupabaseClient } from '@supabase/supabase-js';
export declare class UsersService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    findAll(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(userData: any): Promise<any>;
    update(id: string, updates: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
