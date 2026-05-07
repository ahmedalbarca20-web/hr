import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class TasksService {
    constructor(
        @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    ) { }

    async findAll(companyId?: string, employeeId?: string) {
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
                // If join fails, fallback to simple select
                const { data: simple, error: simpleError } = await this.supabase
                    .from('tasks')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (simpleError) throw simpleError;
                return simple ?? [];
            }
            return data ?? [];
        } catch (err: any) {
            if (err?.code === '42P01') {
                // table does not exist yet
                return [];
            }
            throw err;
        }
    }

    async findOne(id: string) {
        const { data, error } = await this.supabase
            .from('tasks')
            .select(`
                *,
                employees!tasks_assigned_to_fkey (id, full_name)
            `)
            .eq('id', id)
            .single();

        if (error) throw new NotFoundException('المهمة غير موجودة');
        return data;
    }

    async getStats(companyId?: string) {
        let query = this.supabase.from('tasks').select('status');
        if (companyId) query = query.eq('company_id', companyId);
        const { data, error } = await query;
        if (error) return { pending: 0, in_progress: 0, completed: 0, total: 0 };
        const tasks = data ?? [];
        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            in_progress: tasks.filter(t => t.status === 'in_progress').length,
            completed: tasks.filter(t => t.status === 'completed').length,
        };
    }

    async create(data: any) {
        const { data: created, error } = await this.supabase
            .from('tasks')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return created;
    }

    async update(id: string, data: any) {
        const { data: updated, error } = await this.supabase
            .from('tasks')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updated;
    }

    async remove(id: string) {
        const { error } = await this.supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    }
}
