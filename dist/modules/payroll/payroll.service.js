"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let PayrollService = class PayrollService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async list() {
        const { data, error } = await this.supabase.from('payroll').select('*');
        if (error)
            throw error;
        return data ?? [];
    }
    async findOne(id) {
        const { data, error } = await this.supabase.from('payroll').select('*').eq('id', id).single();
        if (error)
            throw error;
        return data;
    }
    async findByEmployee(employeeId) {
        const { data, error } = await this.supabase.from('payroll').select('*').eq('employee_id', employeeId);
        if (error)
            throw error;
        return data ?? [];
    }
    async create(dto) {
        const netSalary = (dto.base_salary || 0) - (dto.deductions || 0) + (dto.overtime_amount || 0);
        const { data, error } = await this.supabase.from('payroll').insert({ ...dto, net_salary: netSalary }).select().single();
        if (error)
            throw error;
        return data;
    }
    async update(id, dto) {
        const { data, error } = await this.supabase.from('payroll').update(dto).eq('id', id).select().single();
        if (error)
            throw error;
        return data;
    }
    async remove(id) {
        const { error } = await this.supabase.from('payroll').delete().eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
    async generateMonthlyPayroll(month) {
        const { data: employees } = await this.supabase
            .from('employees')
            .select('id, salary')
            .eq('status', 'active');
        if (!employees || employees.length === 0) {
            return { generated: 0 };
        }
        const payrollRecords = employees.map(emp => ({
            employee_id: emp.id,
            base_salary: emp.salary || 0,
            deductions: 0,
            overtime_amount: 0,
            net_salary: emp.salary || 0,
            month,
        }));
        const { data, error } = await this.supabase.from('payroll').insert(payrollRecords).select();
        return { generated: data?.length || 0, error };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map