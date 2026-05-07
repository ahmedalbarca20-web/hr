import { SupabaseClient } from '@supabase/supabase-js';
export declare class DocumentsService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    create(createDocumentDto: any): Promise<any>;
    findAll(employeeId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDocumentDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    findExpiring(days?: number): Promise<any[]>;
}
