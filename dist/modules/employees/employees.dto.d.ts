export declare class CreateEmployeeDto {
    company_id: string;
    full_name: string;
    email?: string;
    biometric_id?: string;
    department_id?: string;
    role?: string;
    salary?: number;
    hire_date?: string;
    status?: string;
    work_hours_per_day?: number;
    work_hours_per_week?: number;
}
export declare class UpdateEmployeeDto {
    full_name?: string;
    email?: string;
    biometric_id?: string;
    department_id?: string;
    role?: string;
    salary?: number;
    hire_date?: string;
    status?: string;
    work_hours_per_day?: number;
    work_hours_per_week?: number;
}
