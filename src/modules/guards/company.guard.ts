import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user ?? {};
    const userId = user.sub;

    if (!userId) {
      throw new ForbiddenException('User ID not found in token');
    }

    // Get user profile
    const { data: profile, error } = await this.supabase
      .from('user_profiles')
      .select('company_id, role')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      throw new ForbiddenException('User profile not found');
    }

    // Attach company_id and role to request
    request.companyId = profile.company_id;
    request.userRole = profile.role;

    return true;
  }
}
