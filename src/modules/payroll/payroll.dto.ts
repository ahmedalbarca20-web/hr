export class CreatePayrollDto {
  employee_id: string;
  base_salary?: number;
  deductions?: number;
  overtime_amount?: number;
  net_salary?: number;
  month: string;
}

export class UpdatePayrollDto {
  base_salary?: number;
  deductions?: number;
  overtime_amount?: number;
  net_salary?: number;
}
