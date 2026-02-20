import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { SupabaseJwtGuard } from '../guards/supabase-jwt.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(SupabaseJwtGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance/:companyId')
  @Roles('super_admin', 'company_admin')
  async getAttendanceReport(
    @Param('companyId') companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.reportsService.getAttendanceReport({
      companyId,
      startDate,
      endDate,
      employeeId,
    });
  }

  @Get('payroll/:companyId')
  @Roles('super_admin', 'company_admin')
  async getPayrollReport(
    @Param('companyId') companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.reportsService.getPayrollReport({
      companyId,
      startDate,
      endDate,
      employeeId,
    });
  }

  @Get('leave/:companyId')
  @Roles('super_admin', 'company_admin')
  async getLeaveReport(
    @Param('companyId') companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('employeeId') employeeId?: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.getLeaveReport({
      companyId,
      startDate,
      endDate,
      employeeId,
      status,
    });
  }

  @Get('employees/:companyId')
  @Roles('super_admin', 'company_admin')
  async getEmployeeReport(
    @Param('companyId') companyId: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.getEmployeeReport({
      companyId,
      status,
    });
  }

  @Get('usage/:companyId')
  @Roles('super_admin', 'company_admin')
  async getCompanyUsageReport(@Param('companyId') companyId: string) {
    return this.reportsService.getCompanyUsageReport(companyId);
  }

  @Get('summary/:companyId')
  @Roles('super_admin', 'company_admin')
  async getDashboardSummary(@Param('companyId') companyId: string) {
    return this.reportsService.generateDashboardSummary(companyId);
  }
}
