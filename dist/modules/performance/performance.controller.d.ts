import { PerformanceService } from './performance.service';
export declare class PerformanceController {
    private readonly performanceService;
    constructor(performanceService: PerformanceService);
    create(createPerformanceDto: any): Promise<any>;
    findAll(employeeId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePerformanceDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
