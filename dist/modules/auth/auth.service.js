"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
function isAuthNetworkError(message) {
    if (!message)
        return false;
    const m = message.toLowerCase();
    return (m.includes('fetch failed') ||
        m.includes('failed to fetch') ||
        m.includes('network') ||
        m.includes('enotfound') ||
        m.includes('econnrefused') ||
        m.includes('getaddrinfo') ||
        m.includes('name not resolved'));
}
let AuthService = class AuthService {
    supabase;
    configService;
    constructor(supabase, configService) {
        this.supabase = supabase;
        this.configService = configService;
    }
    devBypassEnabled() {
        if (process.env.NODE_ENV === 'production')
            return false;
        const fromConfig = this.configService.get('auth.devBypass');
        if (fromConfig === true)
            return true;
        return process.env.AUTH_DEV_BYPASS === 'true';
    }
    getDevEmail() {
        return (this.configService.get('auth.devEmail') ??
            process.env.AUTH_DEV_EMAIL ??
            'superadmin@hr-demo.local');
    }
    getDevPassword() {
        return (this.configService.get('auth.devPassword') ??
            process.env.AUTH_DEV_PASSWORD ??
            'LocalHr#2026!Alpha');
    }
    getDevJwtSecret() {
        return (this.configService.get('auth.devJwtSecret') ??
            process.env.AUTH_DEV_JWT_SECRET ??
            'local-dev-insecure-secret');
    }
    matchesDevLogin(email, password) {
        const devEmail = this.getDevEmail().trim().toLowerCase();
        const devPassword = this.getDevPassword();
        const normEmail = (email || '').trim().toLowerCase();
        return normEmail === devEmail && password === devPassword;
    }
    issueDevSession(devEmail) {
        const secret = this.getDevJwtSecret();
        const access_token = (0, jsonwebtoken_1.sign)({
            sub: '00000000-0000-0000-0000-000000000099',
            email: devEmail,
            aud: 'authenticated',
            role: 'authenticated',
            user_metadata: {
                role: 'super_admin',
                email: devEmail,
                full_name: 'Dev Super Admin',
            },
        }, secret, { expiresIn: '7d' });
        return {
            access_token,
            user: {
                id: '00000000-0000-0000-0000-000000000099',
                email: devEmail,
                role: 'super_admin',
                company_id: null,
                full_name: 'Dev Super Admin',
            },
        };
    }
    async login(email, password) {
        const isProd = process.env.NODE_ENV === 'production';
        if (!isProd && this.devBypassEnabled() && this.matchesDevLogin(email, password)) {
            return this.issueDevSession(this.getDevEmail().trim());
        }
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error || !data.session) {
            const msg = error?.message || '';
            if (!isProd &&
                this.devBypassEnabled() &&
                isAuthNetworkError(msg) &&
                this.matchesDevLogin(email, password)) {
                return this.issueDevSession(this.getDevEmail().trim());
            }
            if (isAuthNetworkError(msg)) {
                throw new common_1.UnauthorizedException('تعذر الاتصال بخادم المصادقة (شبكة أو DNS). للتطوير المحلي: AUTH_DEV_BYPASS=true وبيانات من DEMO_CREDENTIALS.md');
            }
            throw new common_1.UnauthorizedException(msg || 'بيانات الدخول غير صحيحة');
        }
        return {
            access_token: data.session.access_token,
            user: {
                id: data.user?.id,
                email: data.user?.email,
                role: data.user?.user_metadata?.role ||
                    data.user?.app_metadata?.role ||
                    'employee',
                company_id: data.user?.user_metadata?.company_id ||
                    data.user?.app_metadata?.company_id ||
                    null,
                full_name: data.user?.user_metadata?.full_name ||
                    data.user?.email ||
                    '',
            },
        };
    }
    async getProfile(userId) {
        const { data, error } = await this.supabase
            .from('user_profiles')
            .select('*, companies(name)')
            .eq('user_id', userId)
            .maybeSingle();
        if (error)
            throw error;
        return data;
    }
    async refreshToken(refreshToken) {
        const { data, error } = await this.supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error || !data.session) {
            throw new common_1.UnauthorizedException('انتهت صلاحية الجلسة');
        }
        return {
            access_token: data.session.access_token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map