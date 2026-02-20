import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SupabaseClient } from '@supabase/supabase-js';
import { AttendanceService } from '../attendance/attendance.service';
import { SUPABASE_CLIENT } from '../database/supabase.provider';
import { DeviceConnectionInfo } from '../common/types';
import { ZktecoService } from './zkteco/zkteco.service';

@Injectable()
export class DeviceSyncService {
  private readonly logger = new Logger(DeviceSyncService.name);

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly attendanceService: AttendanceService,
    private readonly zktecoService: ZktecoService,
  ) { }

  // @Cron(process.env.DEVICE_SYNC_CRON ?? '*/5 * * * *')
  async syncDevices() {
    const devices = await this.fetchDevices();

    for (const device of devices) {
      if (device.deviceType === 'ZKTeco') {
        await this.syncZktecoDevice(device);
      }
    }
  }

  private async fetchDevices(): Promise<DeviceConnectionInfo[]> {
    const { data, error } = await this.supabase
      .from('biometric_devices')
      .select('*')
      .eq('status', 'active');

    if (error) {
      this.logger.error('Failed to fetch biometric devices', error);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      companyId: row.company_id,
      deviceName: row.device_name,
      deviceType: row.device_type,
      ipAddress: row.ip_address,
      port: row.port,
      serialNumber: row.serial_number,
      deviceToken: row.device_token,
    }));
  }

  private async syncZktecoDevice(device: DeviceConnectionInfo) {
    this.logger.log(`Syncing ZKTeco device ${device.deviceName}`);

    const logs = await this.zktecoService.pullAttendanceLogs(device);
    if (logs.length === 0) {
      return;
    }

    await this.attendanceService.saveRawLogs(device.companyId, device.id, logs);
    await this.attendanceService.processRawLogs(device.companyId, logs);

    await this.supabase
      .from('biometric_devices')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', device.id);
  }
}
