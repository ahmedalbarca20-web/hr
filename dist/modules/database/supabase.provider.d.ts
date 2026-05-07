import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare const SUPABASE_CLIENT = "SUPABASE_CLIENT";
export declare const supabaseProvider: {
    provide: string;
    inject: (typeof ConfigService)[];
    useFactory: (configService: ConfigService) => SupabaseClient;
};
