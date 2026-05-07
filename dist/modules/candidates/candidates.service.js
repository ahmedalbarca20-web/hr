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
exports.CandidatesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let CandidatesService = class CandidatesService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async create(dto) {
        const { data, error } = await this.supabase.from('candidates').insert(dto).select().single();
        if (error)
            throw error;
        return data;
    }
    async findAll(jobId) {
        let query = this.supabase.from('candidates').select('*, jobs(title)');
        if (jobId)
            query = query.eq('job_id', jobId);
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async findOne(id) {
        const { data, error } = await this.supabase
            .from('candidates')
            .select('*, jobs(title)')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async update(id, dto) {
        const { data, error } = await this.supabase
            .from('candidates')
            .update(dto)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async remove(id) {
        const { error } = await this.supabase.from('candidates').delete().eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
    async hire(id, company_id) {
        const candidate = await this.findOne(id);
        if (!candidate)
            throw new Error('Candidate not found');
        const { data: employee, error: empError } = await this.supabase
            .from('employees')
            .insert({
            company_id: company_id,
            full_name: candidate.full_name,
            email: candidate.email,
            status: 'active',
            hire_date: new Date().toISOString()
        })
            .select()
            .single();
        if (empError)
            throw empError;
        await this.update(id, { status: 'hired' });
        return employee;
    }
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], CandidatesService);
//# sourceMappingURL=candidates.service.js.map