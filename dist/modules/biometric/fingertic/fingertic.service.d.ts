import { SupabaseClient } from '@supabase/supabase-js';
import { AttendanceService } from '../../attendance/attendance.service';
import { EmployeesService } from '../../employees/employees.service';
import { FingerticWebhook } from './fingertic.webhook';
import { RawAttendanceLog } from '../../common/types';
export declare class FingerticService {
    private readonly supabase;
    private readonly attendanceService;
    private readonly employeesService;
    private readonly webhook;
    private readonly logger;
    constructor(supabase: SupabaseClient, attendanceService: AttendanceService, employeesService: EmployeesService, webhook: FingerticWebhook);
    handleWebhook(deviceToken: string, payload: unknown): Promise<{
        received: number;
    }>;
    private resolveDevice;
    pullAttendanceLogs(device: any): Promise<RawAttendanceLog[]>;
    getDeviceInfo(device: any): Promise<{
        serial: any;
        firmware: string;
        time: string;
        stats: {
            userCounts: number;
            logCounts: number;
        };
    }>;
    getUsers(device: any): Promise<never[]>;
    deleteUser(device: any, userId: string): Promise<{
        success: boolean;
    }>;
    updateUser(device: any, uid: string, data: any): Promise<{
        success: boolean;
    }>;
    clearAttendance(device: any): Promise<{
        success: boolean;
    }>;
    enrollUserToDatabase(device: any, uid: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
