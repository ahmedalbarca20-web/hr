import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';

@Injectable()
export class UsersService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) { }

  async findAll(companyId?: string) {
    try {
      // Query with join on companies table
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
        // Fallback: fetch users without joining company
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
    } catch (err: any) {
      // PGRST205: Could not find the table
      if (err.code === 'PGRST205' || (err.message && err.message.includes('schema cache'))) {
        console.warn('Backend Warning: user_profiles table missing. Returning empty list.');
        return [];
      }
      console.error('UsersService findAll error:', err);
      throw err;
    }
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create a user profile (Assuming auth user is created separately or we just manage profile here)
  // Create a user in Auth and then their profile
  async create(userData: any) {
    const { email, password, full_name, role, company_id } = userData;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      if (!company_id || company_id.length !== 36) {
        console.warn('Invalid company_id provided to create user:', company_id);
        // Don't throw if we want to allow creating users without company, but here we likely need it.
      }

      // 1. Create user in Supabase Auth
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

      // 2. Create profile
      // Quick schema check
      const { error: schemaError } = await this.supabase
        .from('user_profiles')
        .select('user_id')
        .limit(1);

      const hasUserIdColumn = !schemaError;

      const profileData: any = {
        email,
        full_name,
        role,
        company_id
      };

      // Always set ID to match Auth User ID
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
        // Clean up auth user if profile fails to prevent orphan users
        await this.supabase.auth.admin.deleteUser(authUser.user.id).catch(e => console.error('Cleanup failed:', e));
        throw error;
      }

      return data;
    } catch (e: any) {
      // Handle "Email already exists" error
      if (e.code === 'email_exists' || e.status === 422) {
        try {
          // Attempt auto-recovery for orphan users (Auth exists, but Profile missing)
          const { data: { users } } = await this.supabase.auth.admin.listUsers();
          const existingUser = (users || []).find((u: any) => u.email === email);

          if (existingUser) {
            const { data: profile } = await this.supabase
              .from('user_profiles')
              .select('id')
              .eq('id', existingUser.id)
              .maybeSingle();

            if (!profile) {
              console.warn(`Found orphan user ${existingUser.id} (email: ${email}). Deleting to allow fresh creation.`);
              // Delete the orphan auth user
              await this.supabase.auth.admin.deleteUser(existingUser.id);
              // Throw specific error requiring retry
              throw new Error('تم اكتشاف حساب معلق غير مكتمل وتم حذفه. يرجى المحاولة مرة أخرى الآن.');
            }
          }
        } catch (recoveryError) {
          console.error('Recovery check failed:', recoveryError);
        }

        throw new Error('البريد الإلكتروني مسجل بالفعل لمستخدم آخر.');
      }

      console.error('Create User Exception:', e);
      throw e;
    }
  }

  async update(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}
