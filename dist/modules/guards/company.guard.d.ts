import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class CompanyGuard implements CanActivate {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
