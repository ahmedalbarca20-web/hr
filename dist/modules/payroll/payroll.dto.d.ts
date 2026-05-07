export declare class CreatePayrollDto {
    company_id: string;
    employee_id: string;
    base_salary?: number;
    deductions?: number;
    overtime_amount?: number;
    net_salary?: number;
    month: string;
}
export declare class UpdatePayrollDto {
    base_salary?: number;
    deductions?: number;
    overtime_amount?: number;
    net_salary?: number;
}
