import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { DatabaseModule } from '../database/database.module';
import { DeviceSyncService } from './device-sync.service';
import { FingerticController } from './fingertic/fingertic.controller';
import { FingerticService } from './fingertic/fingertic.service';
import { FingerticWebhook } from './fingertic/fingertic.webhook';
import { ZktecoGateway } from './zkteco/zkteco.gateway';
import { ZktecoParser } from './zkteco/zkteco.parser';
import { ZktecoService } from './zkteco/zkteco.service';

@Module({
  imports: [AuthModule, AttendanceModule, DatabaseModule],
  controllers: [FingerticController],
  providers: [
    DeviceSyncService,
    ZktecoService,
    ZktecoGateway,
    ZktecoParser,
    FingerticService,
    FingerticWebhook,
  ],
})
export class BiometricModule {}
