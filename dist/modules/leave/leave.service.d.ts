import { SupabaseClient } from '@supabase/supabase-js';
import { CreateLeaveDto, UpdateLeaveDto } from './leave.dto';
export declare class LeaveService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    list(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateLeaveDto): Promise<any>;
    update(id: string, dto: UpdateLeaveDto): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    approve(id: string): Promise<any>;
    reject(id: string): Promise<any>;
}
