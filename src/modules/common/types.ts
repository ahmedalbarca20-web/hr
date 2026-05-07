export type LogType = 'check_in' | 'check_out';

export interface RawAttendanceLog {
  biometricUserId: string;
  timestamp: string;
  logType: LogType;
}

export interface DeviceConnectionInfo {
  id: string;
  companyId: string;
  deviceName: string;
  deviceType: 'ZKTeco' | 'FingerTec';
  ipAddress: string;
  port?: number | null;
  serialNumber?: string | null;
  deviceToken?: string | null;
}
