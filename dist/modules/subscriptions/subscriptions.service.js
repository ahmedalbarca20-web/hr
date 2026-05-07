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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let SubscriptionsService = class SubscriptionsService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async listByCompany(companyId) {
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
    async getOne(id) {
        const { data, error } = await this.supabase
            .from('company_subscriptions')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async create(companyId, subscriptionData) {
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
        if (error)
            throw error;
        return data;
    }
    async update(id, updates) {
        const { data, error } = await this.supabase
            .from('company_subscriptions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async delete(id) {
        const { error } = await this.supabase
            .from('company_subscriptions')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
    async getUsage(companyId) {
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
        const { count: employeeCount } = await this.supabase
            .from('employees')
            .select('*', { count: 'exact' })
            .eq('company_id', companyId);
        const { count: deviceCount } = await this.supabase
            .from('biometric_devices')
            .select('*', { count: 'exact' })
            .eq('company_id', companyId);
        const currentDate = new Date();
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const { data: attendanceData } = await this.supabase
            .from('attendance')
            .select('duration')
            .eq('company_id', companyId)
            .gte('check_in', monthStart.toISOString());
        const totalHours = (attendanceData ?? []).reduce((sum, rec) => {
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
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map