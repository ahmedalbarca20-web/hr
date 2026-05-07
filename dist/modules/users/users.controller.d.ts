import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(companyId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(userData: any): Promise<any>;
    update(id: string, updates: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
