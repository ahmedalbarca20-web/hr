import { SupabaseClient } from '@supabase/supabase-js';
export declare class DevicesService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    private isTransientListError;
    private throwIfUnreachable;
    private rethrowAs503IfOffline;
    private normalizeDeviceType;
    private defaultSettings;
    private ensureActiveSubscription;
    list(companyId?: string): Promise<any[]>;
    private normalizeDeviceRows;
    getStats(): Promise<{
        total_devices: number;
        enabled_devices: number;
        disabled_devices: number;
        avg_sync_interval_minutes: number;
        last_sync: string | null;
    }>;
    findOne(id: string): Promise<any>;
    create(dto: any): Promise<Record<string, unknown> & {
        last_sync: unknown;
    }>;
    update(id: string, dto: any): Promise<Record<string, unknown> & {
        last_sync: unknown;
    }>;
    getSettings(deviceId: string): Promise<{
        timezone: string;
        sync_interval_minutes: number;
        retry_count: number;
        is_enabled: boolean;
        device_id: string;
    }>;
    upsertSettings(deviceId: string, settings?: any): Promise<any>;
    remove(id: string): Promise<{
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
    testConnectionParams(params: {
        ip_address: string;
        port: number;
        comm_key?: string;
    }): Promise<{
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
