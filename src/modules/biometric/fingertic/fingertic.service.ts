import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { AttendanceService } from '../../attendance/attendance.service';
import { SUPABASE_CLIENT } from '../../database/supabase.provider';
import { FingerticWebhook } from './fingertic.webhook';

@Injectable()
export class FingerticService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly attendanceService: AttendanceService,
    private readonly webhook: FingerticWebhook,
  ) {}

  async handleWebhook(deviceToken: string, payload: unknown) {
    if (!deviceToken) {
      throw new UnauthorizedException('Missing device token');
    }

    const device = await this.resolveDevice(deviceToken);
    const logs = this.webhook.parseAttendanceEvents(payload);

    await this.attendanceService.saveRawLogs(device.company_id, device.id, logs);
    await this.attendanceService.processRawLogs(device.company_id, logs);

    return { received: logs.length };
  }

  private async resolveDevice(deviceToken: string) {
    const { data, error } = await this.supabase
      .from('biometric_devices')
      .select('*')
      .eq('device_token', deviceToken)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('Invalid device token');
    }

    return data;
  }
}
