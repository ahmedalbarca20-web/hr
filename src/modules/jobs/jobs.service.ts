import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class JobsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(createJobDto: any) {
    const { data, error } = await this.supabase
      .from('jobs')
      .insert(createJobDto)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async findAll(companyId?: string) {
    let query = this.supabase.from('jobs').select('*, departments(name)');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('jobs')
      .select('*, departments(name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, updateJobDto: any) {
    const { data, error } = await this.supabase
      .from('jobs')
      .update(updateJobDto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  }
}
