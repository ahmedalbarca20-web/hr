import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './departments.dto';

@Controller('departments')
// @UseGuards(SupabaseJwtGuard, TenantGuard) // مؤقتاً معطل
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async listDepartments() {
    return this.departmentsService.list();
  }

  @Get(':id')
  async getDepartment(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  async createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.departmentsService.create(dto);
  }

  @Patch(':id')
  async updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
