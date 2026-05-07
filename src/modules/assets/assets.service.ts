import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class AssetsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async create(createAssetDto: any) {
    const { data, error } = await this.supabase
      .from('assets')
      .insert(createAssetDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(companyId?: string) {
    let query = this.supabase.from('assets').select('*');
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updateAssetDto: any) {
    const { data, error } = await this.supabase
      .from('assets')
      .update(updateAssetDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}
