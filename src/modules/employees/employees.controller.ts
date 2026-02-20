import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';

@Controller('employees')
// @UseGuards(SupabaseJwtGuard, TenantGuard) // مؤقتاً معطل
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async listEmployees() {
    return this.employeesService.list();
  }

  @Get(':id')
  async getEmployee(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  async createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Patch(':id')
  async updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
