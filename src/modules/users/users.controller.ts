import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../guards/roles.guard';
import { SupabaseJwtGuard } from '../guards/supabase-jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(SupabaseJwtGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('super_admin', 'admin', 'company_admin')
  findAll(@Query('company_id') companyId?: string) {
    return this.usersService.findAll(companyId);
  }

  @Get(':id')
  @Roles('super_admin', 'admin', 'company_admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('super_admin', 'admin', 'company_admin')
  create(@Body() userData: any) {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  @Roles('super_admin', 'admin', 'company_admin')
  update(@Param('id') id: string, @Body() updates: any) {
    return this.usersService.update(id, updates);
  }

  @Delete(':id')
  @Roles('super_admin', 'admin', 'company_admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
