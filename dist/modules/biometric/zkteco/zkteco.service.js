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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ZktecoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZktecoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_provider_1 = require("../../database/supabase.provider");
const zkteco_js_1 = __importDefault(require("zkteco-js"));
const employees_service_1 = require("../../employees/employees.service");
let ZktecoService = ZktecoService_1 = class ZktecoService {
    supabase;
    configService;
    employeesService;
    logger = new common_1.Logger(ZktecoService_1.name);
    constructor(supabase, configService, employeesService) {
        this.supabase = supabase;
        this.configService = configService;
        this.employeesService = employeesService;
    }
    async createZkInstance(device) {
        const ip = device.ip_address || device.ipAddress;
        const port = Number(device.port) || 4370;
        const timeout = 20000;
        const zk = new zkteco_js_1.default(ip, port, timeout, 4000);
        const commKey = device.comm_key || device.commKey || 0;
        zk.commKey = parseInt(commKey) || 0;
        return zk;
    }
    async getDeviceInfo(device) {
        const zk = await this.createZkInstance(device);
        try {
            await zk.createSocket();
            const serial = await zk.getSerialNumber();
            const firmware = await zk.getFirmware();
            const time = await zk.getTime();
            const stats = await zk.getInfo();
            return {
                serial: this.sanitizeString(serial),
                firmware: this.sanitizeString(firmware),
                time: time,
                stats: stats,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get device info for ${device.ip_address}: ${error.message}`);
            throw error;
        }
        finally {
            try {
                await zk.disconnect();
            }
            catch (e) { }
        }
    }
    async fetchAttendanceLogs(device) {
        const zk = await this.createZkInstance(device);
        try {
            await zk.createSocket();
            const logs = await zk.getAttendances();
            const mappedLogs = logs.data.map((log) => ({
                ...log,
                verification_mode: this.getVerificationMode(log.type),
            }));
            return mappedLogs;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to fetch logs for ${device.ip_address}: ${msg}`, error?.stack);
            throw error;
        }
        finally {
            try {
                await zk.disconnect();
            }
            catch (e) { }
        }
    }
    async getUsers(device) {
        const zk = await this.createZkInstance(device);
        try {
            await zk.createSocket();
            const users = await zk.getUsers();
            return users.data;
        }
        catch (error) {
            this.logger.error(`Failed to get users for ${device.ip_address}: ${error.message}`);
            throw error;
        }
        finally {
            try {
                await zk.disconnect();
            }
            catch (e) { }
        }
    }
    async uploadUser(device, user) {
        const zk = await this.createZkInstance(device);
        try {
            await zk.createSocket();
            await zk.setUser(user.uid, user.userId, user.name, user.password || '', user.role || 0, user.cardno || 0);
            try {
                const { data: employees } = await this.supabase
                    .from('employees')
                    .select('id')
                    .eq('company_id', device.company_id)
                    .eq('biometric_id', String(user.userId));
                if (employees && employees.length > 0) {
                    await this.employeesService.update(employees[0].id, {
                        full_name: user.name,
                        role: user.role === 14 ? 'admin' : undefined
                    });
                }
            }
            catch (dbErr) {
                this.logger.warn(`Biometric update successful but DB name sync failed: ${dbErr.message}`);
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to upload user ${user.userId} to ${device.ip_address}: ${error.message}`);
            throw error;
        }
        finally {
            try {
                await zk.disconnect();
            }
            catch (e) { }
        }
    }
    async clearAttendance(device) {
        const zk = await this.createZkInstance(device);
        try {
            await zk.createSocket();
            await zk.clearAttendanceLog();
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to clear logs for ${device.ip_address}: ${error.message}`);
            throw error;
        }
        finally {
            try {
                await zk.disconnect();
            }
            catch (e) { }
        }
    }
    async clearAllData(device) {
        const zk = await this.createZkInstance(device);
        try {
            await zk.createSocket();
            await zk.clearData();
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to clear all data for ${device.ip_address}: ${error.message}`);
            throw error;
        }
        finally {
            try {
                await zk.disconnect();
            }
            catch (e) { }
        }
    }
    async syncUsers(sourceDevice, targetDevice, options = {}) {
        this.logger.log(`Syncing users from ${sourceDevice.ip_address} to ${targetDevice.ip_address}`);
        const users = await this.getUsers(sourceDevice);
        let successCount = 0;
        let failCount = 0;
        for (const user of users) {
            try {
                await this.uploadUser(targetDevice, {
                    uid: user.uid,
                    userId: user.userId,
                    name: user.name,
                    password: user.password,
                    role: user.role,
                    cardno: user.cardno
                });
                successCount++;
            }
            catch (err) {
                failCount++;
            }
        }
        return {
            message: `Completed sync: ${successCount} succeeded, ${failCount} failed`,
            total: users.length,
            successCount,
            failCount
        };
    }
    async enrollDeviceUserToDatabase(device, uid) {
        const users = await this.getUsers(device);
        const user = users.find((u) => u.uid === uid);
        if (!user) {
            throw new Error(`User with UID ${uid} not found on device`);
        }
        const employees = await this.employeesService.list(device.company_id);
        const existing = employees.find((e) => e.biometric_id === String(user.userId));
        if (existing) {
            return this.employeesService.update(existing.id, {
                full_name: user.name,
                role: user.role === 14 ? 'admin' : 'employee'
            });
        }
        else {
            return this.employeesService.create({
                company_id: device.company_id,
                full_name: user.name,
                biometric_id: String(user.userId),
                status: 'active',
                role: user.role === 14 ? 'admin' : 'employee'
            });
        }
    }
    async deleteUserFromDevice(device, uid) {
        const zk = await this.createZkInstance(device);
        try {
            await zk.createSocket();
            await zk.deleteUser(uid);
            return { success: true, message: `User ${uid} deleted successfully` };
        }
        catch (error) {
            this.logger.error(`Failed to delete user ${uid} from ${device.ip_address}: ${error.message}`);
            throw error;
        }
        finally {
            try {
                await zk.disconnect();
            }
            catch (e) { }
        }
    }
    async generateReport(device) {
        const logs = await this.fetchAttendanceLogs(device);
        const users = await this.getUsers(device);
        const userMap = new Map();
        users.forEach((u) => userMap.set(u.userId, u));
        return logs.map((log) => {
            const user = userMap.get(log.user_id);
            return {
                userId: log.user_id,
                userName: user ? user.name : 'Unknown',
                time: log.record_time,
                method: log.verification_mode,
                state: log.state === 0 ? 'Check-In' : 'Check-Out'
            };
        });
    }
    getVerificationMode(type) {
        const modes = {
            0: 'Password/PIN',
            1: 'Fingerprint',
            2: 'Card',
            3: 'Finger+Password',
            4: 'Finger+Card',
            10: 'Face',
            15: 'Face',
            20: 'Face+Finger',
            25: 'Palm',
        };
        return modes[type] || `Unknown (${type})`;
    }
    async pullAttendanceLogs(device) {
        const logs = await this.fetchAttendanceLogs(device);
        return logs.map((log) => ({
            biometricUserId: log.user_id,
            timestamp: log.record_time,
            logType: log.state === 0 ? 'check_in' : 'check_out',
        }));
    }
    sanitizeString(str) {
        if (typeof str !== 'string')
            return String(str);
        return str.replace(/\u0000/g, '').trim();
    }
};
exports.ZktecoService = ZktecoService;
exports.ZktecoService = ZktecoService = ZktecoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_provider_1.SUPABASE_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient,
        config_1.ConfigService,
        employees_service_1.EmployeesService])
], ZktecoService);
//# sourceMappingURL=zkteco.service.js.map