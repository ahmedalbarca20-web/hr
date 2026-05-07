import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    listRecords(date?: string, status?: string): Promise<any[]>;
    listRecordsLegacy(): Promise<any[]>;
    getStats(date?: string): Promise<{
        present: number;
        absent: number;
        late: number;
        leave: number;
        total: number;
    }>;
    getRecord(id: string): Promise<any>;
    createRecord(dto: any): Promise<any>;
    processLogs(body: {
        companyId: string;
        logs: any[];
    }): Promise<{
        inserted: number;
    }>;
    updateRecord(id: string, dto: any): Promise<any>;
    deleteRecord(id: string): Promise<{
        success: boolean;
    }>;
}
