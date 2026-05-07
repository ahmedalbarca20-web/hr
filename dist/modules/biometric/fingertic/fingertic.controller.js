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
exports.FingerticController = void 0;
const common_1 = require("@nestjs/common");
const fingertic_service_1 = require("./fingertic.service");
const devices_service_1 = require("../../devices/devices.service");
let FingerticController = class FingerticController {
    fingerticService;
    devicesService;
    constructor(fingerticService, devicesService) {
        this.fingerticService = fingerticService;
        this.devicesService = devicesService;
    }
    async handleWebhook(deviceToken, payload) {
        return this.fingerticService.handleWebhook(deviceToken, payload);
    }
    async getInfo(id) {
        const device = await this.devicesService.findOne(id);
        return this.fingerticService.getDeviceInfo(device);
    }
    async getUsers(id) {
        const device = await this.devicesService.findOne(id);
        return this.fingerticService.getUsers(device);
    }
    async getReport(id) {
        const device = await this.devicesService.findOne(id);
        return this.fingerticService.pullAttendanceLogs(device);
    }
    async deleteUser(id, userId) {
        const device = await this.devicesService.findOne(id);
        return this.fingerticService.deleteUser(device, userId);
    }
    async updateUser(id, uid, body) {
        const device = await this.devicesService.findOne(id);
        return this.fingerticService.updateUser(device, uid, body);
    }
    async clearAttendance(id) {
        const device = await this.devicesService.findOne(id);
        return this.fingerticService.clearAttendance(device);
    }
    async enrollUser(id, uid) {
        const device = await this.devicesService.findOne(id);
        return this.fingerticService.enrollUserToDatabase(device, uid);
    }
};
exports.FingerticController = FingerticController;
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('x-device-token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)(':id/info'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "getInfo", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)(':id/report'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "getReport", null);
__decorate([
    (0, common_1.Delete)(':id/users/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)(':id/user-update/:uid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('uid')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)(':id/clear-attendance'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "clearAttendance", null);
__decorate([
    (0, common_1.Post)(':id/user-enroll/:uid'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FingerticController.prototype, "enrollUser", null);
exports.FingerticController = FingerticController = __decorate([
    (0, common_1.Controller)('biometric/fingertic'),
    __metadata("design:paramtypes", [fingertic_service_1.FingerticService,
        devices_service_1.DevicesService])
], FingerticController);
//# sourceMappingURL=fingertic.controller.js.map