import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { SupabaseJwtGuard } from '../guards/supabase-jwt.guard';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@UseGuards(SupabaseJwtGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('company/:companyId')
  @Roles('super_admin', 'company_admin')
  async listByCompany(@Param('companyId') companyId: string) {
    return this.subscriptionsService.listByCompany(companyId);
  }

  @Get(':id')
  @Roles('super_admin', 'company_admin')
  async getOne(@Param('id') id: string) {
    return this.subscriptionsService.getOne(id);
  }

  @Post('company/:companyId')
  @Roles('super_admin')
  async create(@Param('companyId') companyId: string, @Body() data: any) {
    return this.subscriptionsService.create(companyId, data);
  }

  @Put(':id')
  @Roles('super_admin')
  async update(@Param('id') id: string, @Body() updates: any) {
    return this.subscriptionsService.update(id, updates);
  }

  @Delete(':id')
  @Roles('super_admin')
  async delete(@Param('id') id: string) {
    return this.subscriptionsService.delete(id);
  }

  @Get('usage/:companyId')
  @Roles('super_admin', 'company_admin')
  async getUsage(@Param('companyId') companyId: string) {
    return this.subscriptionsService.getUsage(companyId);
  }
}
