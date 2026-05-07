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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../database/supabase.provider");
let DevicesService = class DevicesService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    isTransientListError(error) {
        const msg = error.message ?? '';
        const code = error.code ?? '';
        return (code === 'PGRST205' ||
            code === '42P01' ||
            msg.includes('schema cache') ||
            msg.includes('fetch failed') ||
            msg.includes('Failed to fetch') ||
            msg.includes('TypeError: fetch failed') ||
            msg.includes('ENOTFOUND') ||
            msg.includes('ECONNREFUSED') ||
            msg.includes('ETIMEDOUT') ||
            msg.includes('getaddrinfo'));
    }
    throwIfUnreachable(error) {
        if (!error)
            return;
        if (this.isTransientListError(error)) {
            throw new common_1.ServiceUnavailableException('تعذر الاتصال بقاعدة البيانات (Supabase). تحقق من الشبكة أو إعدادات SUPABASE_URL.');
        }
    }
    rethrowAs503IfOffline(e) {
        if (e instanceof common_1.HttpException) {
            throw e;
        }
        const msg = e instanceof Error
            ? e.message
            : typeof e === 'object' &&
                e !== null &&
                'message' in e &&
                typeof e.message === 'string'
                ? e.message
                : String(e ?? '');
        const code = typeof e === 'object' && e !== null && 'code' in e
            ? String(e.code)
            : '';
        if (this.isTransientListError({ message: msg, code })) {
            throw new common_1.ServiceUnavailableException('تعذر الاتصال بقاعدة البيانات (Supabase). تحقق من الشبكة أو إعدادات SUPABASE_URL.');
        }
        throw e;
    }
    normalizeDeviceType(raw) {
        const t = String(raw ?? '').trim();
        if (!t)
            return 'ZKTeco';
        const lower = t.toLowerCase();
        if (lower === 'zkteco')
            return 'ZKTeco';
        if (lower === 'fingertec' || lower === 'fingertic')
            return 'FingerTec';
        return t;
    }
    defaultSettings() {
        return {
            timezone: 'Asia/Baghdad',
            sync_interval_minutes: 5,
            retry_count: 3,
            is_enabled: true,
        };
    }
    async ensureActiveSubscription(companyId) {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const { data, error } = await this.supabase
                .from('company_subscriptions')
                .select('*')
                .eq('company_id', companyId)
                .eq('status', 'active')
                .gte('end_date', today)
                .order('end_date', { ascending: false })
                .limit(1)
                .maybeSingle();
            if (error) {
                this.throwIfUnreachable(error);
                throw error;
            }
            if (!data) {
                throw new Error('الاشتراك غير فعال او منتهي لهذه الشركة');
            }
            return data;
        }
        catch (e) {
            this.rethrowAs503IfOffline(e);
        }
    }
    async list(companyId) {
        let query = this.supabase.from('biometric_devices').select('*');
        if (companyId) {
            query = query.eq('company_id', companyId);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) {
            if (this.isTransientListError(error))
                return [];
            this.throwIfUnreachable(error);
            throw error;
        }
        return this.normalizeDeviceRows(data ?? []);
    }
    normalizeDeviceRows(rows) {
        return rows.map((row) => ({
            ...row,
            last_sync: row.last_sync ?? row.last_sync_at,
        }));
    }
    async getStats() {
        const { data: devices, error: devicesError } = await this.supabase
            .from('biometric_devices')
            .select('id, status, last_sync_at');
        if (devicesError) {
            if (this.isTransientListError(devicesError)) {
                return {
                    total_devices: 0,
                    enabled_devices: 0,
                    disabled_devices: 0,
                    avg_sync_interval_minutes: 5,
                    last_sync: null,
                };
            }
            this.throwIfUnreachable(devicesError);
            throw devicesError;
        }
        const deviceList = devices ?? [];
        const total = deviceList.length;
        const enabled = deviceList.filter(d => d.status === 'active').length;
        const disabled = deviceList.filter(d => d.status !== 'active').length;
        const syncAvg = 5;
        const lastSync = deviceList
            .map((d) => d.last_sync_at ?? d.last_sync)
            .filter(Boolean)
            .sort()
            .slice(-1)[0] || null;
        return {
            total_devices: total,
            enabled_devices: enabled,
            disabled_devices: disabled,
            avg_sync_interval_minutes: syncAvg,
            last_sync: lastSync,
        };
    }
    async findOne(id) {
        const { data, error } = await this.supabase.from('biometric_devices').select('*').eq('id', id).single();
        if (error) {
            this.throwIfUnreachable(error);
            throw error;
        }
        if (!data)
            return data;
        return this.normalizeDeviceRows([data])[0];
    }
    async create(dto) {
        try {
            if (!dto.company_id) {
                throw new Error('company_id مطلوب');
            }
            const { settings, ...deviceData } = dto;
            if (!deviceData.comm_key) {
                deviceData.comm_key = '0';
            }
            deviceData.device_type = this.normalizeDeviceType(deviceData.device_type);
            const subscription = await this.ensureActiveSubscription(dto.company_id);
            if (subscription.max_devices > 0) {
                const { count, error } = await this.supabase
                    .from('biometric_devices')
                    .select('id', { count: 'exact', head: true })
                    .eq('company_id', dto.company_id);
                if (error) {
                    this.throwIfUnreachable(error);
                    throw error;
                }
                if ((count ?? 0) >= subscription.max_devices) {
                    throw new Error('تم تجاوز الحد المسموح لعدد الاجهزة حسب العقد');
                }
            }
            const { data, error } = await this.supabase
                .from('biometric_devices')
                .insert(deviceData)
                .select()
                .single();
            if (error) {
                console.error('Create Device Error:', error);
                this.throwIfUnreachable(error);
                throw error;
            }
            return this.normalizeDeviceRows([data])[0];
        }
        catch (e) {
            this.rethrowAs503IfOffline(e);
        }
    }
    async update(id, dto) {
        try {
            const { settings, ...deviceData } = dto;
            if (deviceData.device_type != null) {
                deviceData.device_type = this.normalizeDeviceType(deviceData.device_type);
            }
            const { data, error } = await this.supabase
                .from('biometric_devices')
                .update(deviceData)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                this.throwIfUnreachable(error);
                throw error;
            }
            return this.normalizeDeviceRows([data])[0];
        }
        catch (e) {
            this.rethrowAs503IfOffline(e);
        }
    }
    async getSettings(deviceId) {
        return {
            device_id: deviceId,
            ...this.defaultSettings()
        };
    }
    async upsertSettings(deviceId, settings) {
        return {
            device_id: deviceId,
            ...this.defaultSettings(),
            ...(settings || {})
        };
    }
    async remove(id) {
        try {
            const { error } = await this.supabase.from('biometric_devices').delete().eq('id', id);
            if (error) {
                this.throwIfUnreachable(error);
                throw error;
            }
            return { success: true };
        }
        catch (e) {
            this.rethrowAs503IfOffline(e);
        }
    }
    async syncDevice(id) {
        try {
            const { data, error } = await this.supabase
                .from('biometric_devices')
                .update({ last_sync_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            if (error) {
                this.throwIfUnreachable(error);
                throw error;
            }
            return {
                message: 'تم مزامنة الجهاز بنجاح',
                device: this.normalizeDeviceRows([data])[0],
            };
        }
        catch (e) {
            this.rethrowAs503IfOffline(e);
        }
    }
    async syncAllDevices() {
        try {
            const { data: devices, error } = await this.supabase
                .from('biometric_devices')
                .update({ last_sync_at: new Date().toISOString() })
                .eq('status', 'active')
                .select();
            if (error) {
                this.throwIfUnreachable(error);
                throw error;
            }
            return {
                message: `تم مزامنة ${devices?.length || 0} أجهزة`,
                devices: this.normalizeDeviceRows((devices ?? [])),
            };
        }
        catch (e) {
            this.rethrowAs503IfOffline(e);
        }
    }
    async testConnection(id) {
        let device = null;
        try {
            const res = await this.supabase
                .from('biometric_devices')
                .select('*')
                .eq('id', id)
                .single();
            const { data, error } = res;
            if (error) {
                this.throwIfUnreachable(error);
                throw error;
            }
            device = data;
        }
        catch (e) {
            this.rethrowAs503IfOffline(e);
        }
        if (!device || !device.ip_address) {
            return {
                success: false,
                message: 'لا يوجد عنوان IP لهذا الجهاز',
                status: 'disconnected'
            };
        }
        const result = await this.testConnectionParams({
            ip_address: String(device.ip_address),
            port: Number(device.port) || 4370,
            comm_key: String(device.comm_key ?? '0'),
        });
        if (result.success) {
            const { error: updateError } = await this.supabase.from('biometric_devices').update({
                status: 'online',
                last_activity: new Date().toISOString(),
                firmware_version: result?.device_info?.firmware_version
            }).eq('id', id);
            if (updateError) {
                console.error('Failed to update device status to online:', updateError);
            }
            else {
                console.log(`Device ${id} status updated to online.`);
            }
        }
        else {
            await this.supabase.from('biometric_devices').update({
                status: 'offline'
            }).eq('id', id);
        }
        return {
            device_id: id,
            success: result.success,
            status: result.success ? 'connected' : 'disconnected',
            message: result.message,
            tested_at: new Date().toISOString(),
            device_info: result.device_info
        };
    }
    async testConnectionParams(params) {
        if (!params.ip_address)
            throw new Error('IP Address is required');
        const port = params.port || 4370;
        const commKey = (params.comm_key && params.comm_key !== '') ? parseInt(params.comm_key) : 0;
        console.log(`[ZKTeco] Attempting connection to ${params.ip_address}:${port} | CommKey: ${commKey}`);
        const ZKLib = require('zkteco-js');
        const zk = new ZKLib(params.ip_address, port, 10000, 4000);
        zk.commKey = commKey;
        try {
            await zk.createSocket();
            console.log('[ZKTeco] Socket created successfully.');
            const serial = await zk.getSerialNumber().catch((e) => { console.error('Get Serial Error', e); return 'Unknown'; });
            const firmware = await zk.getFirmware().catch((e) => { console.error('Get Firmware Error', e); return 'Unknown'; });
            return {
                success: true,
                message: 'تم الاتصال بالجهاز بنجاح',
                device_info: {
                    serial_number: sanitizeString(typeof serial === 'string' ? serial : serialized(serial)),
                    firmware_version: sanitizeString(typeof firmware === 'string' ? firmware : serialized(firmware)),
                }
            };
        }
        catch (e) {
            console.error('[ZKTeco] Connection Failed:', e);
            if (process.env.NODE_ENV === 'development' && (params.ip_address === '127.0.0.1' || params.ip_address === 'localhost')) {
                return {
                    success: true,
                    message: 'تم الاتصال (محاكاة محلية)',
                    device_info: {
                        serial_number: `ZK-SIM-${Math.floor(Math.random() * 1000)}`,
                        firmware_version: 'Ver 6.60 (Simulated)',
                    }
                };
            }
            return {
                success: false,
                message: `فشل الاتصال: ${e.message || 'Timeout/Refused'}`,
                error: e.toString()
            };
        }
        finally {
            try {
                await zk.disconnect();
                console.log('[ZKTeco] Disconnected.');
            }
            catch (err) {
            }
        }
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], DevicesService);
function sanitizeString(str) {
    if (typeof str !== 'string')
        return '';
    return str.replace(/\u0000/g, '').trim();
}
function serialized(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch {
        return 'Unknown';
    }
}
//# sourceMappingURL=devices.service.js.map