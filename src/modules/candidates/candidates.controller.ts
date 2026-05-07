import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) { }

  @Post()
  create(@Body() createCandidateDto: any) {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get()
  findAll(@Query('job_id') jobId: string) {
    return this.candidatesService.findAll(jobId);
  }

  @Post(':id/hire')
  hire(@Param('id') id: string, @Body('company_id') companyId: string) {
    return this.candidatesService.hire(id, companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCandidateDto: any) {
    return this.candidatesService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }
}
