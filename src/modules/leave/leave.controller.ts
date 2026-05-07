import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto, UpdateLeaveDto } from './leave.dto';

@Controller('leave')
// @UseGuards(SupabaseJwtGuard, TenantGuard) // مؤقتاً معطل
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  async listRequests() {
    return this.leaveService.list();
  }

  @Get(':id')
  async getRequest(@Param('id') id: string) {
    return this.leaveService.findOne(id);
  }

  @Post()
  async createRequest(@Body() dto: CreateLeaveDto) {
    return this.leaveService.create(dto);
  }

  @Patch(':id')
  async updateRequest(@Param('id') id: string, @Body() dto: UpdateLeaveDto) {
    return this.leaveService.update(id, dto);
  }

  @Patch(':id/approve')
  async approveRequest(@Param('id') id: string) {
    return this.leaveService.approve(id);
  }

  @Patch(':id/reject')
  async rejectRequest(@Param('id') id: string) {
    return this.leaveService.reject(id);
  }

  @Delete(':id')
  async deleteRequest(@Param('id') id: string) {
    return this.leaveService.remove(id);
  }
}
