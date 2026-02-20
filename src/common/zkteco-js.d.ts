declare module 'zkteco-js' {
    export default class ZKLib {
        constructor(ip: string, port: number, timeout: number, inport: number);
        createSocket(): Promise<void>;
        getUsers(): Promise<any>;
        getAttendances(): Promise<any>;
        getSerialNumber(): Promise<string>;
        getFirmware(): Promise<string>;
        disconnect(): Promise<void>;
        freeData(): Promise<void>;
        disableDevice(): Promise<void>;
        enableDevice(): Promise<void>;
        getInfo(): Promise<any>;
        clearAttendanceLog(): Promise<void>;
        getTime(): Promise<string>;
    }
}
