import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    listByCompany(companyId: string): Promise<any[]>;
    getOne(id: string): Promise<any>;
    create(companyId: string, data: any): Promise<any>;
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
