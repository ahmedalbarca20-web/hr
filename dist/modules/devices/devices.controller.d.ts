import { DevicesService } from './devices.service';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    listDevices(): Promise<any[]>;
    getDeviceStats(): Promise<{
        total_devices: number;
        enabled_devices: number;
        disabled_devices: number;
        avg_sync_interval_minutes: number;
        last_sync: string | null;
    }>;
    getDevice(id: string): Promise<any>;
    createDevice(dto: any): Promise<Record<string, unknown> & {
        last_sync: unknown;
    }>;
    updateDevice(id: string, dto: any): Promise<Record<string, unknown> & {
        last_sync: unknown;
    }>;
    getDeviceSettings(id: string): Promise<{
        timezone: string;
        sync_interval_minutes: number;
        retry_count: number;
        is_enabled: boolean;
        device_id: string;
    }>;
    updateDeviceSettings(id: string, dto: any): Promise<any>;
    deleteDevice(id: string): Promise<{
        success: boolean;
    }>;
    syncDevice(id: string): Promise<{
        message: string;
        device: Record<string, unknown> & {
            last_sync: unknown;
        };
    }>;
    syncAllDevices(): Promise<{
        message: string;
        devices: (Record<string, unknown> & {
            last_sync: unknown;
        })[];
    }>;
    testConnection(id: string): Promise<{
        success: boolean;
        message: string;
        status: string;
        device_id?: undefined;
        tested_at?: undefined;
        device_info?: undefined;
    } | {
        device_id: string;
        success: boolean;
        status: string;
        message: string;
        tested_at: string;
        device_info: {
            serial_number: string;
            firmware_version: string;
        } | undefined;
    }>;
    testConnectionParams(body: any): Promise<{
        success: boolean;
        message: string;
        device_info: {
            serial_number: string;
            firmware_version: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        device_info?: undefined;
    }>;
}
