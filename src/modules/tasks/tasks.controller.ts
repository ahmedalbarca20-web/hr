import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get('stats')
    getStats(@Query('company_id') companyId?: string) {
        return this.tasksService.getStats(companyId);
    }

    @Get()
    findAll(
        @Query('company_id') companyId?: string,
        @Query('employee_id') employeeId?: string,
    ) {
        return this.tasksService.findAll(companyId, employeeId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Post()
    create(@Body() createDto: any) {
        return this.tasksService.create(createDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.tasksService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}

