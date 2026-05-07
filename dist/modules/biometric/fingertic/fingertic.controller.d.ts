import { FingerticService } from './fingertic.service';
import { DevicesService } from '../../devices/devices.service';
export declare class FingerticController {
    private readonly fingerticService;
    private readonly devicesService;
    constructor(fingerticService: FingerticService, devicesService: DevicesService);
    handleWebhook(deviceToken: string, payload: unknown): Promise<{
        received: number;
    }>;
    getInfo(id: string): Promise<{
        serial: any;
        firmware: string;
        time: string;
        stats: {
            userCounts: number;
            logCounts: number;
        };
    }>;
    getUsers(id: string): Promise<never[]>;
    getReport(id: string): Promise<import("../../common/types").RawAttendanceLog[]>;
    deleteUser(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    updateUser(id: string, uid: string, body: any): Promise<{
        success: boolean;
    }>;
    clearAttendance(id: string): Promise<{
        success: boolean;
    }>;
    enrollUser(id: string, uid: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
