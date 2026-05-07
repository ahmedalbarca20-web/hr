import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const supabaseProvider = {
  provide: SUPABASE_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): SupabaseClient => {
    const url = configService.get<string>('supabase.url') ?? '';
    const serviceRoleKey =
      configService.get<string>('supabase.serviceRoleKey') ?? '';

    return createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  },
};
