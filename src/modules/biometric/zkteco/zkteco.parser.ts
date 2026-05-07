import { Injectable } from '@nestjs/common';
import { RawAttendanceLog } from '../../common/types';

@Injectable()
export class ZktecoParser {
  parseAttendanceLogs(raw: Buffer): RawAttendanceLog[] {
    // ZKTeco devices use a binary protocol; implement the vendor spec here.
    // This placeholder returns an empty list to keep the parser safe by default.
    if (!raw || raw.length === 0) {
      return [];
    }

    return [];
  }
}
