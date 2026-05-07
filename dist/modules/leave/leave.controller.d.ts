import { LeaveService } from './leave.service';
import { CreateLeaveDto, UpdateLeaveDto } from './leave.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    listRequests(): Promise<any[]>;
    getRequest(id: string): Promise<any>;
    createRequest(dto: CreateLeaveDto): Promise<any>;
    updateRequest(id: string, dto: UpdateLeaveDto): Promise<any>;
    approveRequest(id: string): Promise<any>;
    rejectRequest(id: string): Promise<any>;
    deleteRequest(id: string): Promise<{
        success: boolean;
    }>;
}
