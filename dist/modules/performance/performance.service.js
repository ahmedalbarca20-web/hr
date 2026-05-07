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
exports.PerformanceService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let PerformanceService = class PerformanceService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async create(createPerformanceDto) {
        if (!createPerformanceDto.strengths && createPerformanceDto.score >= 80) {
            createPerformanceDto.strengths = 'Excellent performance, consistently meets deadlines, high quality work.';
            createPerformanceDto.is_ai_generated = true;
        }
        else if (!createPerformanceDto.weaknesses && createPerformanceDto.score < 50) {
            createPerformanceDto.weaknesses = 'Needs improvement in time management and quality control.';
            createPerformanceDto.is_ai_generated = true;
        }
        const { data, error } = await this.supabase
            .from('performance_reviews')
            .insert(createPerformanceDto)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async findAll(employeeId) {
        let query = this.supabase
            .from('performance_reviews')
            .select('*, employees(full_name, department_id), reviewer:users(email)');
        if (employeeId) {
            query = query.eq('employee_id', employeeId);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async findOne(id) {
        const { data, error } = await this.supabase
            .from('performance_reviews')
            .select('*, employees(full_name)')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async update(id, updatePerformanceDto) {
        const { data, error } = await this.supabase
            .from('performance_reviews')
            .update(updatePerformanceDto)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async remove(id) {
        const { error } = await this.supabase
            .from('performance_reviews')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
};
exports.PerformanceService = PerformanceService;
exports.PerformanceService = PerformanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], PerformanceService);
//# sourceMappingURL=performance.service.js.map