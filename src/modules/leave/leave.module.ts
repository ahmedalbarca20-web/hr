import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
