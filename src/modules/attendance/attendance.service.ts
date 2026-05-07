import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../database/supabase.provider';
import { RawAttendanceLog } from '../common/types';

interface AttendanceRecordInput {
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  lateMinutes: number;
  overtimeMinutes: number;
}

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async saveRawLogs(companyId: string, deviceId: string, logs: RawAttendanceLog[]) {
    if (logs.length === 0) {
      return { inserted: 0 };
    }

    const payload = logs.map((log) => ({
      company_id: companyId,
      device_id: deviceId,
      biometric_user_id: log.biometricUserId,
      timestamp: log.timestamp,
      log_type: log.logType,
    }));

    const { error } = await this.supabase.from('raw_attendance_logs').insert(payload);
    if (error) throw error;
    return { inserted: payload.length };
  }

  async processRawLogs(companyId: string, logs: RawAttendanceLog[]) {
    const employeeMap = await this.resolveEmployeeMap(companyId, logs);
    const records = this.calculateRecords(logs, employeeMap);
    if (records.length === 0) {
      return { inserted: 0 };
    }

    const payload = records.map((record) => ({
      employee_id: record.employeeId,
      date: record.date,
      check_in: record.checkIn,
      check_out: record.checkOut,
      total_hours: record.totalHours,
      late_minutes: record.lateMinutes,
      overtime_minutes: record.overtimeMinutes,
    }));

    const { error } = await this.supabase.from('attendance_records').insert(payload);
    if (error) throw error;
    return { inserted: payload.length };
  }

  async listRecords(date?: string, status?: string) {
    let query = this.supabase.from('attendance_records').select('*, employees(full_name, department_id)');
    if (date) {
      query = query.eq('date', date);
    }
    if (status) {
      query = query.eq('status', status);
    }
    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('attendance_records').select('*, employees(full_name)').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async createRecord(dto: any) {
    const { data, error } = await this.supabase.from('attendance_records').insert(dto).select().single();
    if (error) throw error;
    return data;
  }

  async updateRecord(id: string, dto: any) {
    const { data, error } = await this.supabase.from('attendance_records').update(dto).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async removeRecord(id: string) {
    const { error } = await this.supabase.from('attendance_records').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  async getStats(date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    let query = this.supabase.from('attendance_records').select('status').eq('date', targetDate);
    const { data } = await query;
    const records = data || [];
    return {
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      leave: records.filter(r => r.status === 'leave').length,
      total: records.length,
    };
  }

  private calculateRecords(
    logs: RawAttendanceLog[],
    employeeMap: Map<string, string>,
  ): AttendanceRecordInput[] {
    const grouped = new Map<string, RawAttendanceLog[]>();

    for (const log of logs) {
      const date = log.timestamp.split('T')[0] ?? log.timestamp;
      const key = `${log.biometricUserId}|${date}`;
      const current = grouped.get(key) ?? [];
      current.push(log);
      grouped.set(key, current);
    }

    const records: AttendanceRecordInput[] = [];

    for (const [key, dayLogs] of grouped.entries()) {
      const [biometricUserId, date] = key.split('|');
      const timestamps = dayLogs.map((log) => new Date(log.timestamp).getTime());
      const checkIn = new Date(Math.min(...timestamps)).toISOString();
      const checkOut = new Date(Math.max(...timestamps)).toISOString();
      const totalHours = (Math.max(...timestamps) - Math.min(...timestamps)) / 3600000;

      const employeeId = employeeMap.get(biometricUserId);
      if (!employeeId) {
        continue;
      }

      records.push({
        employeeId,
        date,
        checkIn,
        checkOut,
        totalHours,
        lateMinutes: 0,
        overtimeMinutes: 0,
      });
    }

    return records;
  }

  detectMissingCheckout(records: AttendanceRecordInput[]) {
    return records.map((record) => ({
      ...record,
      checkOut: record.checkOut ?? record.checkIn,
    }));
  }

  applyShiftRules(records: AttendanceRecordInput[]) {
    // TODO: apply shift calendars, grace periods, and overtime policies.
    return records;
  }

  validateGeolocation(_payload: unknown) {
    // TODO: optionally validate geolocation for attendance events.
    return true;
  }

  private async resolveEmployeeMap(
    companyId: string,
    logs: RawAttendanceLog[],
  ): Promise<Map<string, string>> {
    const biometricIds = Array.from(
      new Set(logs.map((log) => log.biometricUserId)),
    );

    if (biometricIds.length === 0) {
      return new Map();
    }

    const { data } = await this.supabase
      .from('employees')
      .select('id, biometric_id')
      .eq('company_id', companyId)
      .in('biometric_id', biometricIds);

    const map = new Map<string, string>();
    for (const row of data ?? []) {
      if (row.biometric_id) {
        map.set(row.biometric_id, row.id);
      }
    }

    return map;
  }
}
