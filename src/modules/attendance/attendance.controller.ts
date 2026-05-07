import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async listRecords(@Query('date') date?: string, @Query('status') status?: string) {
    return this.attendanceService.listRecords(date, status);
  }

  @Get('records')
  async listRecordsLegacy() {
    return this.attendanceService.listRecords();
  }

  @Get('stats')
  async getStats(@Query('date') date?: string) {
    return this.attendanceService.getStats(date);
  }

  @Get(':id')
  async getRecord(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Post()
  async createRecord(@Body() dto: any) {
    return this.attendanceService.createRecord(dto);
  }

  @Post('process')
  async processLogs(@Body() body: { companyId: string; logs: any[] }) {
    return this.attendanceService.processRawLogs(body.companyId, body.logs);
  }

  @Patch(':id')
  async updateRecord(@Param('id') id: string, @Body() dto: any) {
    return this.attendanceService.updateRecord(id, dto);
  }

  @Delete(':id')
  async deleteRecord(@Param('id') id: string) {
    return this.attendanceService.removeRecord(id);
  }
}
