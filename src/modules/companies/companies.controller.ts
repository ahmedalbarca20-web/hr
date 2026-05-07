import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { SupabaseJwtGuard } from '../guards/supabase-jwt.guard';
import { CompaniesService } from './companies.service';

@Controller('companies')
@UseGuards(SupabaseJwtGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Roles('super_admin')
  async listCompanies() {
    return this.companiesService.list();
  }

  @Get(':id')
  @Roles('super_admin', 'company_admin')
  async getOne(@Param('id') id: string) {
    return this.companiesService.getOne(id);
  }

  @Post()
  @Roles('super_admin')
  async create(@Body() companyData: any) {
    return this.companiesService.create(companyData);
  }

  @Put(':id')
  @Roles('super_admin')
  async update(@Param('id') id: string, @Body() updates: any) {
    return this.companiesService.update(id, updates);
  }

  @Patch(':id')
  @Roles('super_admin')
  async patchUpdate(@Param('id') id: string, @Body() updates: any) {
    return this.companiesService.update(id, updates);
  }

  @Delete(':id')
  @Roles('super_admin')
  async delete(@Param('id') id: string) {
    return this.companiesService.delete(id);
  }

  @Get(':id/stats')
  @Roles('super_admin', 'company_admin')
  async getStats(@Param('id') id: string) {
    return this.companiesService.getStats(id);
  }
}
