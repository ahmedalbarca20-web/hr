import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  private async ensureActiveSubscription(companyId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await this.supabase
      .from('company_subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .gte('end_date', today)
      .order('end_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error('الاشتراك غير فعال او منتهي لهذه الشركة');
    }

    return data;
  }

  async list(companyId?: string) {
    let query = this.supabase.from('employees').select('*');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('employees').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(dto: CreateEmployeeDto) {
    if (!dto.company_id) {
      throw new Error('company_id مطلوب');
    }

    const subscription = await this.ensureActiveSubscription(dto.company_id);
    if (subscription.max_employees > 0) {
      const { count, error } = await this.supabase
        .from('employees')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', dto.company_id);

      if (error) throw error;
      if ((count ?? 0) >= subscription.max_employees) {
        throw new Error('تم تجاوز الحد المسموح لعدد الموظفين حسب العقد');
      }
    }

    const { data, error } = await this.supabase.from('employees').insert(dto).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const { data, error } = await this.supabase.from('employees').update(dto).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('employees').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
}
