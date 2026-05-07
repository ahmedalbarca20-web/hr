export declare class CreateLeaveDto {
    company_id: string;
    employee_id: string;
    start_date: string;
    end_date: string;
    reason?: string;
    status?: string;
}
export declare class UpdateLeaveDto {
    start_date?: string;
    end_date?: string;
    reason?: string;
    status?: string;
}
