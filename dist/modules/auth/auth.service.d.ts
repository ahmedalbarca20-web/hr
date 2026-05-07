import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class AuthService {
    private readonly supabase;
    private readonly configService;
    constructor(supabase: SupabaseClient, configService: ConfigService);
    private devBypassEnabled;
    private getDevEmail;
    private getDevPassword;
    private getDevJwtSecret;
    private matchesDevLogin;
    private issueDevSession;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string | undefined;
            role: any;
            company_id: any;
            full_name: any;
        };
    }>;
    getProfile(userId: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
