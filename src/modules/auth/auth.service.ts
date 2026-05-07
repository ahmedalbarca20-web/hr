import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(
        error?.message || 'بيانات الدخول غير صحيحة',
      );
    }

    return {
      access_token: data.session.access_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role:
          data.user?.user_metadata?.role ||
          data.user?.app_metadata?.role ||
          'employee',
        company_id:
          data.user?.user_metadata?.company_id ||
          data.user?.app_metadata?.company_id ||
          null,
        full_name:
          data.user?.user_metadata?.full_name ||
          data.user?.email ||
          '',
      },
    };
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*, companies(name)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('انتهت صلاحية الجلسة');
    }

    return {
      access_token: data.session.access_token,
    };
  }
}
