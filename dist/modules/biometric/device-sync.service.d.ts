import { SupabaseClient } from '@supabase/supabase-js';
import { AttendanceService } from '../attendance/attendance.service';
import { ZktecoService } from './zkteco/zkteco.service';
import { FingerticService } from './fingertic/fingertic.service';
export declare class DeviceSyncService {
    private readonly supabase;
    private readonly attendanceService;
    private readonly zktecoService;
    private readonly fingerticService;
    private readonly logger;
    constructor(supabase: SupabaseClient, attendanceService: AttendanceService, zktecoService: ZktecoService, fingerticService: FingerticService);
    syncDevices(): Promise<void>;
    private fetchDevices;
    private syncZktecoDevice;
    private syncFingerticDevice;
    private updateLastSync;
}
