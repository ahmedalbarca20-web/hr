import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class DocumentsService {
    constructor(
        @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    ) { }

    async create(createDocumentDto: any) {
        const { data, error } = await this.supabase
            .from('employee_documents')
            .insert(createDocumentDto)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async findAll(employeeId?: string) {
        let query = this.supabase.from('employee_documents').select('*');
        if (employeeId) {
            query = query.eq('employee_id', employeeId);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async findOne(id: string) {
        const { data, error } = await this.supabase
            .from('employee_documents')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, updateDocumentDto: any) {
        const { data, error } = await this.supabase
            .from('employee_documents')
            .update(updateDocumentDto)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async remove(id: string) {
        const { error } = await this.supabase
            .from('employee_documents')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    }

    async findExpiring(days: number = 30) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);

        const { data, error } = await this.supabase
            .from('employee_documents')
            .select(`
            *,
            employees (full_name)
        `)
            .lte('expiry_date', targetDate.toISOString())
            .gte('expiry_date', new Date().toISOString());

        if (error) throw error;
        return data;
    }
}
