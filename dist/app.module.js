"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const configuration_1 = __importDefault(require("./modules/config/configuration"));
const database_module_1 = require("./modules/database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const companies_module_1 = require("./modules/companies/companies.module");
const departments_module_1 = require("./modules/departments/departments.module");
const employees_module_1 = require("./modules/employees/employees.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const performance_module_1 = require("./modules/performance/performance.module");
const leave_module_1 = require("./modules/leave/leave.module");
const biometric_module_1 = require("./modules/biometric/biometric.module");
const devices_module_1 = require("./modules/devices/devices.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const reports_module_1 = require("./modules/reports/reports.module");
const users_module_1 = require("./modules/users/users.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const assets_module_1 = require("./modules/assets/assets.module");
const documents_module_1 = require("./modules/documents/documents.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const candidates_module_1 = require("./modules/candidates/candidates.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                exclude: ['/api/*path'],
            }),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            companies_module_1.CompaniesModule,
            departments_module_1.DepartmentsModule,
            employees_module_1.EmployeesModule,
            attendance_module_1.AttendanceModule,
            payroll_module_1.PayrollModule,
            performance_module_1.PerformanceModule,
            leave_module_1.LeaveModule,
            devices_module_1.DevicesModule,
            biometric_module_1.BiometricModule,
            subscriptions_module_1.SubscriptionsModule,
            reports_module_1.ReportsModule,
            users_module_1.UsersModule,
            tasks_module_1.TasksModule,
            assets_module_1.AssetsModule,
            documents_module_1.DocumentsModule,
            jobs_module_1.JobsModule,
            candidates_module_1.CandidatesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map