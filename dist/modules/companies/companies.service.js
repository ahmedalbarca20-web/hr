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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let CompaniesService = class CompaniesService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async list() {
        const { data, error } = await this.supabase
            .from('companies')
            .select('*');
        if (!error)
            return data ?? [];
        if (error.code === 'PGRST200') {
            const fallback = await this.supabase.from('companies').select('*');
            if (fallback.error)
                throw fallback.error;
            return fallback.data ?? [];
        }
        throw error;
    }
    async getOne(id) {
        const { data, error } = await this.supabase
            .from('companies')
            .select('*, company_subscriptions(*)')
            .eq('id', id)
            .single();
        if (!error)
            return data;
        if (error.code === 'PGRST200') {
            const fallback = await this.supabase
                .from('companies')
                .select('*')
                .eq('id', id)
                .single();
            if (fallback.error)
                throw fallback.error;
            return fallback.data;
        }
        throw error;
    }
    async create(companyData) {
        const { data, error } = await this.supabase
            .from('companies')
            .insert([companyData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async update(id, updates) {
        const { data, error } = await this.supabase
            .from('companies')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async delete(id) {
        const { data: subscriptions } = await this.supabase
            .from('company_subscriptions')
            .select('*')
            .eq('company_id', id)
            .eq('status', 'active');
        if (subscriptions && subscriptions.length > 0) {
            throw new common_1.BadRequestException('Cannot delete company with active subscriptions');
        }
        const { error } = await this.supabase
            .from('companies')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
    async getStats(id) {
        const { count: employeeCount } = await this.supabase
            .from('employees')
            .select('*', { count: 'exact' })
            .eq('company_id', id);
        const { count: departmentCount } = await this.supabase
            .from('departments')
            .select('*', { count: 'exact' })
            .eq('company_id', id);
        const { count: deviceCount } = await this.supabase
            .from('biometric_devices')
            .select('*', { count: 'exact' })
            .eq('company_id', id);
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
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map