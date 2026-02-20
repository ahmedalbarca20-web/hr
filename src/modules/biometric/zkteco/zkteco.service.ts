import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeviceConnectionInfo, RawAttendanceLog } from '../../common/types';
import { ZktecoGateway } from './zkteco.gateway';
import { ZktecoParser } from './zkteco.parser';

@Injectable()
export class ZktecoService {
  constructor(
    private readonly configService: ConfigService,
    private readonly gateway: ZktecoGateway,
    private readonly parser: ZktecoParser,
  ) {}

  async pullAttendanceLogs(device: DeviceConnectionInfo): Promise<RawAttendanceLog[]> {
    const port = device.port ??
      this.configService.get<number>('biometric.zktecoDefaultPort') ??
      4370;

    const socket = await this.gateway.connect(device.ipAddress, port);
    const command = this.buildFetchLogsCommand();
    const response = await this.gateway.sendCommand(socket, command);

    return this.parser.parseAttendanceLogs(response);
  }

  async syncUsersToDevice(_device: DeviceConnectionInfo): Promise<void> {
    // TODO: implement user sync using the ZKTeco protocol.
  }

  private buildFetchLogsCommand(): Buffer {
    // Placeholder command. Replace with ZKTeco attendance log command.
    return Buffer.from([]);
  }
}
