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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let UsersService = class UsersService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(companyId) {
        try {
            let query = this.supabase
                .from('user_profiles')
                .select(`
          *,
          companies (
            name
          )
        `);
            if (companyId) {
                query = query.eq('company_id', companyId);
            }
            const { data, error } = await query;
            if (error) {
                console.warn('Join query failed, falling back to simple select. Error:', error.message);
                const { data: fallbackData, error: fallbackError } = await this.supabase
                    .from('user_profiles')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (fallbackError) {
                    console.error('Fallback fetch error:', fallbackError);
                    throw fallbackError;
                }
                return fallbackData || [];
            }
            return data || [];
        }
        catch (err) {
            if (err.code === 'PGRST205' || (err.message && err.message.includes('schema cache'))) {
                console.warn('Backend Warning: user_profiles table missing. Returning empty list.');
                return [];
            }
            console.error('UsersService findAll error:', err);
            throw err;
        }
    }
    async findOne(id) {
        const { data, error } = await this.supabase
            .from('user_profiles')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async create(userData) {
        const { email, password, full_name, role, company_id } = userData;
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        try {
            if (!company_id || company_id.length !== 36) {
                console.warn('Invalid company_id provided to create user:', company_id);
            }
            const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name, role, company_id }
            });
            if (authError) {
                console.error('Supabase Auth Create Error:', authError);
                throw authError;
            }
            const { error: schemaError } = await this.supabase
                .from('user_profiles')
                .select('user_id')
                .limit(1);
            const hasUserIdColumn = !schemaError;
            const profileData = {
                email,
                full_name,
                role,
                company_id
            };
            profileData.id = authUser.user.id;
            if (hasUserIdColumn) {
                profileData.user_id = authUser.user.id;
            }
            const { data, error } = await this.supabase
                .from('user_profiles')
                .upsert([profileData])
                .select()
                .single();
            if (error) {
                console.error('Profile Creation Error:', error);
                await this.supabase.auth.admin.deleteUser(authUser.user.id).catch(e => console.error('Cleanup failed:', e));
                throw error;
            }
            return data;
        }
        catch (e) {
            if (e.code === 'email_exists' || e.status === 422) {
                try {
                    const { data: { users } } = await this.supabase.auth.admin.listUsers();
                    const existingUser = (users || []).find((u) => u.email === email);
                    if (existingUser) {
                        const { data: profile } = await this.supabase
                            .from('user_profiles')
                            .select('id')
                            .eq('id', existingUser.id)
                            .maybeSingle();
                        if (!profile) {
                            console.warn(`Found orphan user ${existingUser.id} (email: ${email}). Deleting to allow fresh creation.`);
                            await this.supabase.auth.admin.deleteUser(existingUser.id);
                            throw new Error('تم اكتشاف حساب معلق غير مكتمل وتم حذفه. يرجى المحاولة مرة أخرى الآن.');
                        }
                    }
                }
                catch (recoveryError) {
                    console.error('Recovery check failed:', recoveryError);
                }
                throw new Error('البريد الإلكتروني مسجل بالفعل لمستخدم آخر.');
            }
            console.error('Create User Exception:', e);
            throw e;
        }
    }
    async update(id, updates) {
        const { data, error } = await this.supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async remove(id) {
        const { error } = await this.supabase
            .from('user_profiles')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], UsersService);
//# sourceMappingURL=users.service.js.map