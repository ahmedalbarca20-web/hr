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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let LeaveService = class LeaveService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async list(companyId) {
        let query = this.supabase.from('leave_requests').select('*');
        if (companyId) {
            query = query.eq('company_id', companyId);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data ?? [];
    }
    async findOne(id) {
        const { data, error } = await this.supabase.from('leave_requests').select('*').eq('id', id).single();
        if (error)
            throw error;
        return data;
    }
    async create(dto) {
        const { data, error } = await this.supabase.from('leave_requests').insert(dto).select().single();
        if (error)
            throw error;
        return data;
    }
    async update(id, dto) {
        const { data, error } = await this.supabase.from('leave_requests').update(dto).eq('id', id).select().single();
        if (error)
            throw error;
        return data;
    }
    async remove(id) {
        const { error } = await this.supabase.from('leave_requests').delete().eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
    async approve(id) {
        const { data, error } = await this.supabase.from('leave_requests').update({ status: 'approved' }).eq('id', id).select().single();
        if (error)
            throw error;
        return data;
    }
    async reject(id) {
        const { data, error } = await this.supabase.from('leave_requests').update({ status: 'rejected' }).eq('id', id).select().single();
        if (error)
            throw error;
        return data;
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], LeaveService);
//# sourceMappingURL=leave.service.js.map