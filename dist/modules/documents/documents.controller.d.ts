import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(createDocumentDto: any): Promise<any>;
    findAll(employeeId?: string): Promise<any[]>;
    findExpiring(days?: number): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDocumentDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
