import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto, UpdatePayrollDto } from './payroll.dto';

@Controller('payroll')
// @UseGuards(SupabaseJwtGuard, TenantGuard) // مؤقتاً معطل
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  async listPayroll() {
    return this.payrollService.list();
  }

  @Get(':id')
  async getPayroll(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  @Get('employee/:employeeId')
  async getEmployeePayroll(@Param('employeeId') employeeId: string) {
    return this.payrollService.findByEmployee(employeeId);
  }

  @Post()
  async createPayroll(@Body() dto: CreatePayrollDto) {
    return this.payrollService.create(dto);
  }

  @Post('generate/:month')
  async generatePayroll(@Param('month') month: string) {
    return this.payrollService.generateMonthlyPayroll(month);
  }

  @Patch(':id')
  async updatePayroll(@Param('id') id: string, @Body() dto: UpdatePayrollDto) {
    return this.payrollService.update(id, dto);
  }

  @Delete(':id')
  async deletePayroll(@Param('id') id: string) {
    return this.payrollService.remove(id);
  }
}
