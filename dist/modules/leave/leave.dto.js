"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeaveDto = exports.CreateLeaveDto = void 0;
class CreateLeaveDto {
    company_id;
    employee_id;
    start_date;
    end_date;
    reason;
    status;
}
exports.CreateLeaveDto = CreateLeaveDto;
class UpdateLeaveDto {
    start_date;
    end_date;
    reason;
    status;
}
exports.UpdateLeaveDto = UpdateLeaveDto;
//# sourceMappingURL=leave.dto.js.map