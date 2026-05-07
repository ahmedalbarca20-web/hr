import { ZktecoService } from './zkteco.service';
import { DevicesService } from '../../devices/devices.service';
import { EmployeesService } from '../../employees/employees.service';
export declare class ZktecoController {
    private readonly zktecoService;
    private readonly devicesService;
    private readonly employeesService;
    constructor(zktecoService: ZktecoService, devicesService: DevicesService, employeesService: EmployeesService);
    ping(): {
        message: string;
    };
    getDeviceInfo(id: string): Promise<{
        serial: string;
        firmware: string;
        time: string;
        stats: any;
    }>;
    getAttendanceLogs(id: string): Promise<any>;
    generateReport(id: string): Promise<any>;
    getUsers(id: string): Promise<any>;
    clearAttendance(id: string): Promise<{
        success: boolean;
    }>;
    clearAllData(id: string): Promise<{
        success: boolean;
    }>;
    syncDevices(body: {
        sourceId: string;
        targetId: string;
    }): Promise<{
        message: string;
        total: any;
        successCount: number;
        failCount: number;
    }>;
    deleteUser(id: string, uid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateDeviceUser(id: string, uid: string, body: {
        name: string;
        userId: string;
        password?: string;
        role?: number;
        cardno?: number;
    }): Promise<{
        success: boolean;
    }>;
    enrollToDatabase(id: string, uid: string): Promise<any>;
    testConnection(id: string): Promise<{
        serial: string;
        firmware: string;
        time: string;
        stats: any;
    }>;
}
