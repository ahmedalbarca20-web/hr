"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePayrollDto = exports.CreatePayrollDto = void 0;
class CreatePayrollDto {
    company_id;
    employee_id;
    base_salary;
    deductions;
    overtime_amount;
    net_salary;
    month;
}
exports.CreatePayrollDto = CreatePayrollDto;
class UpdatePayrollDto {
    base_salary;
    deductions;
    overtime_amount;
    net_salary;
}
exports.UpdatePayrollDto = UpdatePayrollDto;
//# sourceMappingURL=payroll.dto.js.map