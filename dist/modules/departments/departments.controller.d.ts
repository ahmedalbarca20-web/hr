import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    listDepartments(): Promise<any[]>;
    getDepartment(id: string): Promise<any>;
    createDepartment(dto: CreateDepartmentDto): Promise<any>;
    updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<any>;
    deleteDepartment(id: string): Promise<{
        success: boolean;
    }>;
}
