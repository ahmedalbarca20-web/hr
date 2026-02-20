import { Injectable } from '@nestjs/common';
import { RawAttendanceLog } from '../../common/types';

@Injectable()
export class FingerticWebhook {
  parseAttendanceEvents(payload: unknown): RawAttendanceLog[] {
    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const data = payload as { events?: Array<Record<string, unknown>> };
    if (!Array.isArray(data.events)) {
      return [];
    }

    return data.events
      .map((event) => {
        const biometricUserId = String(event['user_id'] ?? '');
        const timestamp = String(event['timestamp'] ?? '');
        const logType = String(event['log_type'] ?? 'check_in');

        if (!biometricUserId || !timestamp) {
          return null;
        }

        return {
          biometricUserId,
          timestamp,
          logType: logType === 'check_out' ? 'check_out' : 'check_in',
        };
      })
      .filter((entry): entry is RawAttendanceLog => entry !== null);
  }
}
