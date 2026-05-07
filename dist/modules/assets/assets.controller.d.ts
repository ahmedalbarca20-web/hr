import { AssetsService } from './assets.service';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    create(createAssetDto: any): Promise<any>;
    findAll(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateAssetDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
