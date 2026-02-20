import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';
import { CreatePayrollDto, UpdatePayrollDto } from './payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async list() {
    const { data, error } = await this.supabase.from('payroll').select('*');
    if (error) throw error;
    return data ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('payroll').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async findByEmployee(employeeId: string) {
    const { data, error } = await this.supabase.from('payroll').select('*').eq('employee_id', employeeId);
    if (error) throw error;
    return data ?? [];
  }

  async create(dto: CreatePayrollDto) {
    const netSalary = (dto.base_salary || 0) - (dto.deductions || 0) + (dto.overtime_amount || 0);
    const { data, error } = await this.supabase.from('payroll').insert({ ...dto, net_salary: netSalary }).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdatePayrollDto) {
    const { data, error } = await this.supabase.from('payroll').update(dto).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('payroll').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  async generateMonthlyPayroll(month: string) {
    // Fetch all active employees and generate payroll records
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
}
