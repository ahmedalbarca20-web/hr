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
exports.ZktecoController = void 0;
const common_1 = require("@nestjs/common");
const zkteco_service_1 = require("./zkteco.service");
const devices_service_1 = require("../../devices/devices.service");
const employees_service_1 = require("../../employees/employees.service");
let ZktecoController = class ZktecoController {
    zktecoService;
    devicesService;
    employeesService;
    constructor(zktecoService, devicesService, employeesService) {
        this.zktecoService = zktecoService;
        this.devicesService = devicesService;
        this.employeesService = employeesService;
    }
    ping() {
        return { message: 'zkteco controller is alive' };
    }
    async getDeviceInfo(id) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.getDeviceInfo(device);
    }
    async getAttendanceLogs(id) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.fetchAttendanceLogs(device);
    }
    async generateReport(id) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.generateReport(device);
    }
    async getUsers(id) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.getUsers(device);
    }
    async clearAttendance(id) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.clearAttendance(device);
    }
    async clearAllData(id) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.clearAllData(device);
    }
    async syncDevices(body) {
        const source = await this.devicesService.findOne(body.sourceId);
        const target = await this.devicesService.findOne(body.targetId);
        return this.zktecoService.syncUsers(source, target);
    }
    async deleteUser(id, uid) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.deleteUserFromDevice(device, parseInt(uid));
    }
    async updateDeviceUser(id, uid, body) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.uploadUser(device, {
            uid: parseInt(uid),
            ...body
        });
    }
    async enrollToDatabase(id, uid) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.enrollDeviceUserToDatabase(device, parseInt(uid));
    }
    async testConnection(id) {
        const device = await this.devicesService.findOne(id);
        return this.zktecoService.getDeviceInfo(device);
    }
};
exports.ZktecoController = ZktecoController;
__decorate([
    (0, common_1.Get)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ZktecoController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)(':id/info'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "getDeviceInfo", null);
__decorate([
    (0, common_1.Get)(':id/attendance'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "getAttendanceLogs", null);
__decorate([
    (0, common_1.Get)(':id/report'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)(':id/clear-attendance'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "clearAttendance", null);
__decorate([
    (0, common_1.Post)(':id/clear-all'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "clearAllData", null);
__decorate([
    (0, common_1.Post)('sync'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "syncDevices", null);
__decorate([
    (0, common_1.Delete)(':id/users/:uid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)(':id/user-update/:uid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "updateDeviceUser", null);
__decorate([
    (0, common_1.Post)(':id/user-enroll/:uid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "enrollToDatabase", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZktecoController.prototype, "testConnection", null);
exports.ZktecoController = ZktecoController = __decorate([
    (0, common_1.Controller)('biometric/zkteco'),
    __metadata("design:paramtypes", [zkteco_service_1.ZktecoService,
        devices_service_1.DevicesService,
        employees_service_1.EmployeesService])
], ZktecoController);
//# sourceMappingURL=zkteco.controller.js.map