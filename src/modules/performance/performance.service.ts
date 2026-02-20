import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class PerformanceService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(createPerformanceDto: any) {
    // Basic AI Simulation based on score
    if (!createPerformanceDto.strengths && createPerformanceDto.score >= 80) {
      createPerformanceDto.strengths = 'Excellent performance, consistently meets deadlines, high quality work.';
      createPerformanceDto.is_ai_generated = true;
    } else if (!createPerformanceDto.weaknesses && createPerformanceDto.score < 50) {
      createPerformanceDto.weaknesses = 'Needs improvement in time management and quality control.';
      createPerformanceDto.is_ai_generated = true;
    }

    const { data, error } = await this.supabase
      .from('performance_reviews')
      .insert(createPerformanceDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(employeeId?: string) {
    let query = this.supabase
      .from('performance_reviews')
      .select('*, employees(full_name, department_id), reviewer:users(email)');

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('performance_reviews')
      .select('*, employees(full_name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updatePerformanceDto: any) {
    const { data, error } = await this.supabase
      .from('performance_reviews')
      .update(updatePerformanceDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('performance_reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}
