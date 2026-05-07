import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async list(companyId?: string) {
    let query = this.supabase.from('departments').select('*');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('departments').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(dto: CreateDepartmentDto) {
    const { data, error } = await this.supabase.from('departments').insert(dto).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const { data, error } = await this.supabase.from('departments').update(dto).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('departments').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
}
