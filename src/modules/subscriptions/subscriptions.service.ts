import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async listByCompany(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('SubscriptionsService listByCompany warning:', error.message);
      return [];
    }
    return data ?? [];
  }

  async getOne(id: string) {
    const { data, error } = await this.supabase
      .from('company_subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(companyId: string, subscriptionData: any) {
    const { data, error } = await this.supabase
      .from('company_subscriptions')
      .insert([
        {
          company_id: companyId,
          ...subscriptionData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('company_subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('company_subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }

  async getUsage(companyId: string) {
    // Get subscription details
    const { data: subscription, error: subError } = await this.supabase
      .from('company_subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      return {
        employees: { used: 0, limit: 0 },
        devices: { used: 0, limit: 0 },
        monthlyHours: { used: 0, limit: 0 },
      };
    }

    // Get employee count
    const { count: employeeCount } = await this.supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    // Get device count
    const { count: deviceCount } = await this.supabase
      .from('devices')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    // Get monthly attendance hours
    const currentDate = new Date();
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const { data: attendanceData } = await this.supabase
      .from('attendance')
      .select('duration')
      .eq('company_id', companyId)
      .gte('check_in', monthStart.toISOString());

    const totalHours =
      (attendanceData ?? []).reduce((sum, rec) => {
        const minutes = rec.duration ?? 0;
        return sum + minutes / 60;
      }, 0);

    return {
      employees: {
        used: employeeCount ?? 0,
        limit: subscription.max_employees ?? 0,
      },
      devices: {
        used: deviceCount ?? 0,
        limit: subscription.max_devices ?? 0,
      },
      monthlyHours: {
        used: Math.round(totalHours * 100) / 100,
        limit: subscription.max_monthly_hours ?? 0,
      },
    };
  }
}
