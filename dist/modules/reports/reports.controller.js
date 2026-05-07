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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../guards/roles.guard");
const supabase_jwt_guard_1 = require("../guards/supabase-jwt.guard");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getAttendanceReport(companyId, startDate, endDate, employeeId) {
        return this.reportsService.getAttendanceReport({
            companyId,
            startDate,
            endDate,
            employeeId,
        });
    }
    async getPayrollReport(companyId, startDate, endDate, employeeId) {
        return this.reportsService.getPayrollReport({
            companyId,
            startDate,
            endDate,
            employeeId,
        });
    }
    async getLeaveReport(companyId, startDate, endDate, employeeId, status) {
        return this.reportsService.getLeaveReport({
            companyId,
            startDate,
            endDate,
            employeeId,
            status,
        });
    }
    async getEmployeeReport(companyId, status) {
        return this.reportsService.getEmployeeReport({
            companyId,
            status,
        });
    }
    async getCompanyUsageReport(companyId) {
        return this.reportsService.getCompanyUsageReport(companyId);
    }
    async getDashboardSummary(companyId) {
        return this.reportsService.generateDashboardSummary(companyId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('attendance/:companyId'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAttendanceReport", null);
__decorate([
    (0, common_1.Get)('payroll/:companyId'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPayrollReport", null);
__decorate([
    (0, common_1.Get)('leave/:companyId'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('employeeId')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLeaveReport", null);
__decorate([
    (0, common_1.Get)('employees/:companyId'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getEmployeeReport", null);
__decorate([
    (0, common_1.Get)('usage/:companyId'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCompanyUsageReport", null);
__decorate([
    (0, common_1.Get)('summary/:companyId'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboardSummary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(supabase_jwt_guard_1.SupabaseJwtGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map