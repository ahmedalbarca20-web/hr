import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
