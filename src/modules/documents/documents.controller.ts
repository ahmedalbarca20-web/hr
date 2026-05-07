import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    create(@Body() createDocumentDto: any) {
        return this.documentsService.create(createDocumentDto);
    }

    @Get()
    findAll(@Query('employee_id') employeeId?: string) {
        return this.documentsService.findAll(employeeId);
    }

    @Get('expiring')
    findExpiring(@Query('days') days: number = 30) {
        return this.documentsService.findExpiring(days);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.documentsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDocumentDto: any) {
        return this.documentsService.update(id, updateDocumentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.documentsService.remove(id);
    }
}
