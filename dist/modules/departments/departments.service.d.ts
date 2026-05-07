import { SupabaseClient } from '@supabase/supabase-js';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';
export declare class DepartmentsService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    list(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateDepartmentDto): Promise<any>;
    update(id: string, dto: UpdateDepartmentDto): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
