import { Injectable, Logger } from '@nestjs/common';
import * as net from 'node:net';

@Injectable()
export class ZktecoGateway {
  private readonly logger = new Logger(ZktecoGateway.name);

  async connect(ipAddress: string, port: number): Promise<net.Socket> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();

      socket.once('error', (error) => {
        this.logger.error('ZKTeco socket error', error);
        reject(error);
      });

      socket.connect(port, ipAddress, () => resolve(socket));
    });
  }

  async sendCommand(socket: net.Socket, payload: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      socket.on('data', (data) => chunks.push(data));
      socket.once('error', (error) => reject(error));
      socket.once('close', () => {
        resolve(Buffer.concat(chunks));
      });

      socket.write(payload, () => socket.end());
    });
  }
}
