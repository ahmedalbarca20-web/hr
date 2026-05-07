import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class CandidatesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(dto: any) {
    const { data, error } = await this.supabase.from('candidates').insert(dto).select().single();
    if (error) throw error;
    return data;
  }

  async findAll(jobId?: string) {
    let query = this.supabase.from('candidates').select('*, jobs(title)');
    if (jobId) query = query.eq('job_id', jobId);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('candidates')
      .select('*, jobs(title)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: string, dto: any) {
    const { data, error } = await this.supabase
      .from('candidates')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('candidates').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  // --- HIRE CANDIDATE ---
  async hire(id: string, company_id: string) {
    // 1. Get candidate
    const candidate = await this.findOne(id);
    if (!candidate) throw new Error('Candidate not found');

    // 2. Create Employee
    const { data: employee, error: empError } = await this.supabase
      .from('employees')
      .insert({
        company_id: company_id,
        full_name: candidate.full_name,
        email: candidate.email,
        status: 'active',
        hire_date: new Date().toISOString()
      })
      .select()
      .single();

    if (empError) throw empError;

    // 3. Update Candidate Status
    await this.update(id, { status: 'hired' });

    return employee;
  }
}
