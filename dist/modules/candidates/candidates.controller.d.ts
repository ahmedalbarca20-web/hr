import { CandidatesService } from './candidates.service';
export declare class CandidatesController {
    private readonly candidatesService;
    constructor(candidatesService: CandidatesService);
    create(createCandidateDto: any): Promise<any>;
    findAll(jobId: string): Promise<any[]>;
    hire(id: string, companyId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCandidateDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
