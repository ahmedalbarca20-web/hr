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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let DepartmentsService = class DepartmentsService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async list(companyId) {
        let query = this.supabase.from('departments').select('*');
        if (companyId) {
            query = query.eq('company_id', companyId);
        }
        const { data, error } = await query;
        if (error) {
            const msg = error.message ?? '';
            const code = error.code ?? '';
            if (code === 'PGRST205' ||
                code === '42P01' ||
                msg.includes('schema cache') ||
                msg.includes('fetch failed') ||
                msg.includes('Failed to fetch') ||
                msg.includes('TypeError: fetch failed')) {
                return [];
            }
            throw error;
        }
        return data ?? [];
    }
    async findOne(id) {
        const { data, error } = await this.supabase.from('departments').select('*').eq('id', id).single();
        if (error)
            throw error;
        return data;
    }
    async create(dto) {
        const { data, error } = await this.supabase.from('departments').insert(dto).select().single();
        if (error)
            throw error;
        return data;
    }
    async update(id, dto) {
        const { data, error } = await this.supabase.from('departments').update(dto).eq('id', id).select().single();
        if (error)
            throw error;
        return data;
    }
    async remove(id) {
        const { error } = await this.supabase.from('departments').delete().eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map