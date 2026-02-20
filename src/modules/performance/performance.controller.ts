import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) { }

  @Post()
  create(@Body() createPerformanceDto: any) {
    return this.performanceService.create(createPerformanceDto);
  }

  @Get()
  findAll(@Query('employee_id') employeeId?: string) {
    return this.performanceService.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerformanceDto: any) {
    return this.performanceService.update(id, updatePerformanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.performanceService.remove(id);
  }
}
