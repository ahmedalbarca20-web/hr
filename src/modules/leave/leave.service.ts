import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';
import { CreateLeaveDto, UpdateLeaveDto } from './leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async list(companyId?: string) {
    let query = this.supabase.from('leave_requests').select('*');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('leave_requests').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(dto: CreateLeaveDto) {
    const { data, error } = await this.supabase.from('leave_requests').insert(dto).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdateLeaveDto) {
    const { data, error } = await this.supabase.from('leave_requests').update(dto).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('leave_requests').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  async approve(id: string) {
    const { data, error } = await this.supabase.from('leave_requests').update({ status: 'approved' }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async reject(id: string) {
    const { data, error } = await this.supabase.from('leave_requests').update({ status: 'rejected' }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
}
