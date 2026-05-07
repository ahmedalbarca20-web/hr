import { SupabaseClient } from '@supabase/supabase-js';
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
export declare class AttendanceService {
    private readonly supabase;
    private readonly logger;
    constructor(supabase: SupabaseClient);
    saveRawLogs(companyId: string, deviceId: string, logs: RawAttendanceLog[]): Promise<{
        inserted: number;
    }>;
    processRawLogs(companyId: string, logs: RawAttendanceLog[]): Promise<{
        inserted: number;
    }>;
    listRecords(date?: string, status?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    createRecord(dto: any): Promise<any>;
    updateRecord(id: string, dto: any): Promise<any>;
    removeRecord(id: string): Promise<{
        success: boolean;
    }>;
    getStats(date?: string): Promise<{
        present: number;
        absent: number;
        late: number;
        leave: number;
        total: number;
    }>;
    private calculateRecords;
    detectMissingCheckout(records: AttendanceRecordInput[]): {
        checkOut: string | null;
        employeeId: string;
        date: string;
        checkIn: string | null;
        totalHours: number;
        lateMinutes: number;
        overtimeMinutes: number;
    }[];
    applyShiftRules(records: AttendanceRecordInput[]): AttendanceRecordInput[];
    validateGeolocation(_payload: unknown): boolean;
    private resolveEmployeeMap;
}
export {};
