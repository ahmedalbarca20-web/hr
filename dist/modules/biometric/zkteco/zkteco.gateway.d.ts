import * as net from 'node:net';
export declare class ZktecoGateway {
    private readonly logger;
    connect(ipAddress: string, port: number): Promise<net.Socket>;
    sendCommand(socket: net.Socket, payload: Buffer): Promise<Buffer>;
}
