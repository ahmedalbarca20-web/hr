import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getStats(companyId?: string): Promise<{
        pending: number;
        in_progress: number;
        completed: number;
        total: number;
    }>;
    findAll(companyId?: string, employeeId?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(createDto: any): Promise<any>;
    update(id: string, updateDto: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
