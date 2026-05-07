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
var FingerticService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerticService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../../database/supabase.provider");
const attendance_service_1 = require("../../attendance/attendance.service");
const employees_service_1 = require("../../employees/employees.service");
const fingertic_webhook_1 = require("./fingertic.webhook");
let FingerticService = FingerticService_1 = class FingerticService {
    supabase;
    attendanceService;
    employeesService;
    webhook;
    logger = new common_1.Logger(FingerticService_1.name);
    constructor(supabase, attendanceService, employeesService, webhook) {
        this.supabase = supabase;
        this.attendanceService = attendanceService;
        this.employeesService = employeesService;
        this.webhook = webhook;
    }
    async handleWebhook(deviceToken, payload) {
        if (!deviceToken) {
            throw new common_1.UnauthorizedException('Missing device token');
        }
        const device = await this.resolveDevice(deviceToken);
        const logs = this.webhook.parseAttendanceEvents(payload);
        await this.attendanceService.saveRawLogs(device.company_id, device.id, logs);
        await this.attendanceService.processRawLogs(device.company_id, logs);
        return { received: logs.length };
    }
    async resolveDevice(deviceToken) {
        const { data, error } = await this.supabase
            .from('biometric_devices')
            .select('*')
            .eq('device_token', deviceToken)
            .single();
        if (error || !data) {
            throw new common_1.UnauthorizedException('Invalid device token');
        }
        return data;
    }
    async pullAttendanceLogs(device) {
        this.logger.log(`Pulling logs for FingerTec device: ${device.id}`);
        return [];
    }
    async getDeviceInfo(device) {
        return {
            serial: device.serial_number || 'FT-SCANNER',
            firmware: 'V1.0.0 (Cloud)',
            time: new Date().toISOString(),
            stats: { userCounts: 0, logCounts: 0 }
        };
    }
    async getUsers(device) {
        return [];
    }
    async deleteUser(device, userId) {
        this.logger.log(`Deleting user ${userId} from FingerTec device ${device.id}`);
        return { success: true };
    }
    async updateUser(device, uid, data) {
        this.logger.log(`Updating user ${uid} on FingerTec device ${device.id} with data:`, data);
        try {
            const { data: employees } = await this.supabase
                .from('employees')
                .select('id')
                .eq('company_id', device.company_id)
                .eq('biometric_id', String(data.userId || uid));
            if (employees && employees.length > 0) {
                await this.employeesService.update(employees[0].id, {
                    full_name: data.name
                });
            }
        }
        catch (dbErr) {
            this.logger.warn(`Fingertic name sync failed: ${dbErr.message}`);
        }
        return { success: true };
    }
    async clearAttendance(device) {
        this.logger.log(`Clearing attendance logs for FingerTec device ${device.id}`);
        return { success: true };
    }
    async enrollUserToDatabase(device, uid) {
        this.logger.log(`Enrolling FingerTec user ${uid} from device ${device.id}`);
        return { success: true, message: 'User enrolled (Placeholder)' };
    }
};
exports.FingerticService = FingerticService;
exports.FingerticService = FingerticService = FingerticService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        attendance_service_1.AttendanceService,
        employees_service_1.EmployeesService,
        fingertic_webhook_1.FingerticWebhook])
], FingerticService);
//# sourceMappingURL=fingertic.service.js.map