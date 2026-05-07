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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let TasksService = class TasksService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll(companyId, employeeId) {
        try {
            let query = this.supabase
                .from('tasks')
                .select(`
                    *,
                    employees!tasks_assigned_to_fkey (id, full_name)
                `);
            if (companyId) {
                query = query.eq('company_id', companyId);
            }
            if (employeeId) {
                query = query.eq('assigned_to', employeeId);
            }
            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) {
                const { data: simple, error: simpleError } = await this.supabase
                    .from('tasks')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (simpleError)
                    throw simpleError;
                return simple ?? [];
            }
            return data ?? [];
        }
        catch (err) {
            if (err?.code === '42P01') {
                return [];
            }
            throw err;
        }
    }
    async findOne(id) {
        const { data, error } = await this.supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assigned_to_fkey (id, full_name)
            `)
            .eq('id', id)
            .single();
        if (error)
            throw new common_1.NotFoundException('المهمة غير موجودة');
        return data;
    }
    async getStats(companyId) {
        let query = this.supabase.from('tasks').select('status');
        if (companyId)
            query = query.eq('company_id', companyId);
        const { data, error } = await query;
        if (error)
            return { pending: 0, in_progress: 0, completed: 0, total: 0 };
        const tasks = data ?? [];
        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            in_progress: tasks.filter(t => t.status === 'in_progress').length,
            completed: tasks.filter(t => t.status === 'completed').length,
        };
    }
    async create(data) {
        const { data: created, error } = await this.supabase
            .from('tasks')
            .insert(data)
            .select()
            .single();
        if (error)
            throw error;
        return created;
    }
    async update(id, data) {
        const { data: updated, error } = await this.supabase
            .from('tasks')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return updated;
    }
    async remove(id) {
        const { error } = await this.supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], TasksService);
//# sourceMappingURL=tasks.service.js.map