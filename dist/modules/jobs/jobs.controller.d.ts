import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    create(createJobDto: any): Promise<any>;
    findAll(companyId: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateJobDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
