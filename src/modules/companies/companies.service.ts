import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async list() {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*'); // Simplified query to avoid relation errors

    if (!error) return data ?? [];

    if (error.code === 'PGRST200') {
      const fallback = await this.supabase.from('companies').select('*');
      if (fallback.error) throw fallback.error;
      return fallback.data ?? [];
    }

    throw error;
  }

  async getOne(id: string) {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*, company_subscriptions(*)')
      .eq('id', id)
      .single();

    if (!error) return data;

    if (error.code === 'PGRST200') {
      const fallback = await this.supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      if (fallback.error) throw fallback.error;
      return fallback.data;
    }

    throw error;
  }

  async create(companyData: any) {
    const { data, error } = await this.supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    // Check if company has active subscriptions
    const { data: subscriptions } = await this.supabase
      .from('company_subscriptions')
      .select('*')
      .eq('company_id', id)
      .eq('status', 'active');

    if (subscriptions && subscriptions.length > 0) {
      throw new BadRequestException(
        'Cannot delete company with active subscriptions',
      );
    }

    const { error } = await this.supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }

  async getStats(id: string) {
    // Employee count
    const { count: employeeCount } = await this.supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .eq('company_id', id);

    // Department count
    const { count: departmentCount } = await this.supabase
      .from('departments')
      .select('*', { count: 'exact' })
      .eq('company_id', id);

    // Device count
    const { count: deviceCount } = await this.supabase
      .from('biometric_devices')
      .select('*', { count: 'exact' })
      .eq('company_id', id);

    // Users count
    const { count: userCount } = await this.supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .eq('company_id', id);

    return {
      employees: employeeCount ?? 0,
      departments: departmentCount ?? 0,
      devices: deviceCount ?? 0,
      users: userCount ?? 0,
    };
  }
}
