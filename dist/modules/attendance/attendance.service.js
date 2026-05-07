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
var AttendanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let AttendanceService = AttendanceService_1 = class AttendanceService {
    supabase;
    logger = new common_1.Logger(AttendanceService_1.name);
    constructor(supabase) {
        this.supabase = supabase;
    }
    async saveRawLogs(companyId, deviceId, logs) {
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
        if (error)
            throw error;
        return { inserted: payload.length };
    }
    async processRawLogs(companyId, logs) {
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
        if (error)
            throw error;
        return { inserted: payload.length };
    }
    async listRecords(date, status) {
        let query = this.supabase
            .from('attendance')
            .select('*, employees(full_name, department_id)');
        if (date) {
            query = query.gte('check_in', `${date}T00:00:00Z`).lte('check_in', `${date}T23:59:59Z`);
        }
        if (status) {
            query = query.eq('status', status);
        }
        const { data, error } = await query.order('check_in', { ascending: false });
        if (error) {
            this.logger.error('List Records Error:', error);
            return [];
        }
        return data ?? [];
    }
    async findOne(id) {
        const { data, error } = await this.supabase
            .from('attendance')
            .select('*, employees(full_name)')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async createRecord(dto) {
        const payload = {
            employee_id: dto.employee_id,
            company_id: dto.company_id,
            check_in: dto.check_in ? `${dto.date}T${dto.check_in}:00Z` : `${dto.date}T09:00:00Z`,
            check_out: dto.check_out ? `${dto.date}T${dto.check_out}:00Z` : null,
            notes: dto.notes,
            status: dto.status || 'present',
            source: 'manual',
        };
        this.logger.log('Creating manual record with payload:', JSON.stringify(payload));
        const { data, error } = await this.supabase
            .from('attendance')
            .insert(payload)
            .select()
            .single();
        if (error) {
            this.logger.error('Create Record Error Details:', JSON.stringify(error));
            throw error;
        }
        return data;
    }
    async updateRecord(id, dto) {
        const { data, error } = await this.supabase.from('attendance_records').update(dto).eq('id', id).select().single();
        if (error)
            throw error;
        return data;
    }
    async removeRecord(id) {
        const { error } = await this.supabase.from('attendance_records').delete().eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
    async getStats(date) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const { data, error } = await this.supabase
            .from('attendance')
            .select('status')
            .gte('check_in', `${targetDate}T00:00:00Z`)
            .lte('check_in', `${targetDate}T23:59:59Z`);
        if (error) {
            this.logger.error('Get Stats Error:', error);
            return { present: 0, absent: 0, late: 0, leave: 0, total: 0 };
        }
        const records = data || [];
        return {
            present: records.filter(r => r.status === 'present').length,
            absent: records.filter(r => r.status === 'absent').length,
            late: records.filter(r => r.status === 'late').length,
            leave: records.filter(r => r.status === 'on_leave' || r.status === 'leave').length,
            total: records.length,
        };
    }
    calculateRecords(logs, employeeMap) {
        const grouped = new Map();
        for (const log of logs) {
            const date = log.timestamp.split('T')[0] ?? log.timestamp;
            const key = `${log.biometricUserId}|${date}`;
            const current = grouped.get(key) ?? [];
            current.push(log);
            grouped.set(key, current);
        }
        const records = [];
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
    detectMissingCheckout(records) {
        return records.map((record) => ({
            ...record,
            checkOut: record.checkOut ?? record.checkIn,
        }));
    }
    applyShiftRules(records) {
        return records;
    }
    validateGeolocation(_payload) {
        return true;
    }
    async resolveEmployeeMap(companyId, logs) {
        const biometricIds = Array.from(new Set(logs.map((log) => log.biometricUserId)));
        if (biometricIds.length === 0) {
            return new Map();
        }
        const { data } = await this.supabase
            .from('employees')
            .select('id, biometric_id')
            .eq('company_id', companyId)
            .in('biometric_id', biometricIds);
        const map = new Map();
        for (const row of data ?? []) {
            if (row.biometric_id) {
                map.set(row.biometric_id, row.id);
            }
        }
        return map;
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = AttendanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map