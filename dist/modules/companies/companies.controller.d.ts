import { CompaniesService } from './companies.service';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    listCompanies(): Promise<any[]>;
    getOne(id: string): Promise<any>;
    create(companyData: any): Promise<any>;
    update(id: string, updates: any): Promise<any>;
    patchUpdate(id: string, updates: any): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    getStats(id: string): Promise<{
        employees: number;
        departments: number;
        devices: number;
        users: number;
    }>;
}
