import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    listEmployees(): Promise<any[]>;
    getEmployee(id: string): Promise<any>;
    createEmployee(dto: CreateEmployeeDto): Promise<any>;
    updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<any>;
    deleteEmployee(id: string): Promise<{
        success: boolean;
    }>;
}
