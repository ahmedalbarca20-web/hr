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
var DeviceSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSyncService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const attendance_service_1 = require("../attendance/attendance.service");
const supabase_provider_1 = require("../database/supabase.provider");
const zkteco_service_1 = require("./zkteco/zkteco.service");
const fingertic_service_1 = require("./fingertic/fingertic.service");
let DeviceSyncService = DeviceSyncService_1 = class DeviceSyncService {
    supabase;
    attendanceService;
    zktecoService;
    fingerticService;
    logger = new common_1.Logger(DeviceSyncService_1.name);
    constructor(supabase, attendanceService, zktecoService, fingerticService) {
        this.supabase = supabase;
        this.attendanceService = attendanceService;
        this.zktecoService = zktecoService;
        this.fingerticService = fingerticService;
    }
    async syncDevices() {
        const devices = await this.fetchDevices();
        for (const device of devices) {
            if (device.deviceType === 'ZKTeco') {
                await this.syncZktecoDevice(device);
            }
            else if (device.deviceType === 'FingerTec' || device.deviceType === 'Fingertic') {
                await this.syncFingerticDevice(device);
            }
        }
    }
    async fetchDevices() {
        const { data, error } = await this.supabase
            .from('biometric_devices')
            .select('*')
            .eq('status', 'active');
        if (error) {
            this.logger.error('Failed to fetch biometric devices', error);
            return [];
        }
        return (data ?? []).map((row) => ({
            id: row.id,
            companyId: row.company_id,
            deviceName: row.device_name,
            deviceType: row.device_type,
            ipAddress: row.ip_address,
            port: row.port,
            serialNumber: row.serial_number,
            deviceToken: row.device_token,
        }));
    }
    async syncZktecoDevice(device) {
        this.logger.log(`Syncing ZKTeco device ${device.deviceName}`);
        try {
            const logs = await this.zktecoService.pullAttendanceLogs(device);
            if (logs && logs.length > 0) {
                await this.attendanceService.saveRawLogs(device.companyId, device.id, logs);
                await this.attendanceService.processRawLogs(device.companyId, logs);
            }
            await this.updateLastSync(device.id);
        }
        catch (error) {
            this.logger.error(`Failed to sync ZKTeco device ${device.id}: ${error.message}`);
        }
    }
    async syncFingerticDevice(device) {
        this.logger.log(`Syncing Fingertic device ${device.deviceName}`);
        try {
            const logs = await this.fingerticService.pullAttendanceLogs(device);
            if (logs && logs.length > 0) {
                await this.attendanceService.saveRawLogs(device.companyId, device.id, logs);
                await this.attendanceService.processRawLogs(device.companyId, logs);
            }
            await this.updateLastSync(device.id);
        }
        catch (error) {
            this.logger.error(`Failed to sync Fingertic device ${device.id}: ${error.message}`);
        }
    }
    async updateLastSync(deviceId) {
        await this.supabase
            .from('biometric_devices')
            .update({ last_sync: new Date().toISOString(), status: 'online' })
            .eq('id', deviceId);
    }
};
exports.DeviceSyncService = DeviceSyncService;
exports.DeviceSyncService = DeviceSyncService = DeviceSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        attendance_service_1.AttendanceService,
        zkteco_service_1.ZktecoService,
        fingertic_service_1.FingerticService])
], DeviceSyncService);
//# sourceMappingURL=device-sync.service.js.map