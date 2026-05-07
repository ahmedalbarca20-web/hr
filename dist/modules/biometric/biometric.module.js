"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const attendance_module_1 = require("../attendance/attendance.module");
const database_module_1 = require("../database/database.module");
const devices_module_1 = require("../devices/devices.module");
const device_sync_service_1 = require("./device-sync.service");
const fingertic_controller_1 = require("./fingertic/fingertic.controller");
const fingertic_service_1 = require("./fingertic/fingertic.service");
const fingertic_webhook_1 = require("./fingertic/fingertic.webhook");
const zkteco_controller_1 = require("./zkteco/zkteco.controller");
const zkteco_gateway_1 = require("./zkteco/zkteco.gateway");
const zkteco_parser_1 = require("./zkteco/zkteco.parser");
const zkteco_service_1 = require("./zkteco/zkteco.service");
const employees_module_1 = require("../employees/employees.module");
let BiometricModule = class BiometricModule {
};
exports.BiometricModule = BiometricModule;
exports.BiometricModule = BiometricModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, attendance_module_1.AttendanceModule, database_module_1.DatabaseModule, devices_module_1.DevicesModule, employees_module_1.EmployeesModule],
        controllers: [fingertic_controller_1.FingerticController, zkteco_controller_1.ZktecoController],
        providers: [
            device_sync_service_1.DeviceSyncService,
            zkteco_service_1.ZktecoService,
            zkteco_gateway_1.ZktecoGateway,
            zkteco_parser_1.ZktecoParser,
            fingertic_service_1.FingerticService,
            fingertic_webhook_1.FingerticWebhook,
        ],
    })
], BiometricModule);
//# sourceMappingURL=biometric.module.js.map