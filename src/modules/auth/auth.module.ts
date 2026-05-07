import { Module } from '@nestjs/common';
import { SupabaseJwtGuard } from '../guards/supabase-jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { TenantGuard } from '../guards/tenant.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseJwtGuard, RolesGuard, TenantGuard],
  exports: [AuthService, SupabaseJwtGuard, RolesGuard, TenantGuard],
})
export class AuthModule {}
