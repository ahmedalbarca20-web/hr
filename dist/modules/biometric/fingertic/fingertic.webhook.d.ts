import { RawAttendanceLog } from '../../common/types';
export declare class FingerticWebhook {
    parseAttendanceEvents(payload: unknown): RawAttendanceLog[];
}
