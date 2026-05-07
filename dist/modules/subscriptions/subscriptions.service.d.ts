import { SupabaseClient } from '@supabase/supabase-js';
export declare class SubscriptionsService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    listByCompany(companyId: string): Promise<any[]>;
    getOne(id: string): Promise<any>;
    create(companyId: string, subscriptionData: any): Promise<any>;
    update(id: string, updates: any): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    getUsage(companyId: string): Promise<{
        employees: {
            used: number;
            limit: any;
        };
        devices: {
            used: number;
            limit: any;
        };
        monthlyHours: {
            used: number;
            limit: any;
        };
    }>;
}
