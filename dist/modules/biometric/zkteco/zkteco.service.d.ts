import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { RawAttendanceLog } from '../../common/types';
import { EmployeesService } from '../../employees/employees.service';
export declare class ZktecoService {
    private readonly supabase;
    private readonly configService;
    private readonly employeesService;
    private readonly logger;
    constructor(supabase: SupabaseClient, configService: ConfigService, employeesService: EmployeesService);
    private createZkInstance;
    getDeviceInfo(device: any): Promise<{
        serial: string;
        firmware: string;
        time: string;
        stats: any;
    }>;
    fetchAttendanceLogs(device: any): Promise<any>;
    getUsers(device: any): Promise<any>;
    uploadUser(device: any, user: {
        uid: number;
        userId: string;
        name: string;
        password?: string;
        role?: number;
        cardno?: number;
    }): Promise<{
        success: boolean;
    }>;
    clearAttendance(device: any): Promise<{
        success: boolean;
    }>;
    clearAllData(device: any): Promise<{
        success: boolean;
    }>;
    syncUsers(sourceDevice: any, targetDevice: any, options?: {
        syncTemplates?: boolean;
    }): Promise<{
        message: string;
        total: any;
        successCount: number;
        failCount: number;
    }>;
    enrollDeviceUserToDatabase(device: any, uid: number): Promise<any>;
    deleteUserFromDevice(device: any, uid: number): Promise<{
        success: boolean;
        message: string;
    }>;
    generateReport(device: any): Promise<any>;
    private getVerificationMode;
    pullAttendanceLogs(device: any): Promise<RawAttendanceLog[]>;
    private sanitizeString;
}
