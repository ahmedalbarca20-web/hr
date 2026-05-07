import { RawAttendanceLog } from '../../common/types';
export declare class ZktecoParser {
    parseAttendanceLogs(raw: Buffer): RawAttendanceLog[];
}
