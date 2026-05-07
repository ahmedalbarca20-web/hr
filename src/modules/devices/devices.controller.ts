import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  @Get()
  async listDevices() {
    return this.devicesService.list();
  }

  @Get('stats')
  async getDeviceStats() {
    return this.devicesService.getStats();
  }

  @Get(':id')
  async getDevice(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Post()
  async createDevice(@Body() dto: any) {
    return this.devicesService.create(dto);
  }

  @Patch(':id')
  async updateDevice(@Param('id') id: string, @Body() dto: any) {
    return this.devicesService.update(id, dto);
  }

  @Get(':id/settings')
  async getDeviceSettings(@Param('id') id: string) {
    return this.devicesService.getSettings(id);
  }

  @Patch(':id/settings')
  async updateDeviceSettings(@Param('id') id: string, @Body() dto: any) {
    return this.devicesService.upsertSettings(id, dto);
  }

  @Delete(':id')
  async deleteDevice(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }

  @Post(':id/sync')
  async syncDevice(@Param('id') id: string) {
    return this.devicesService.syncDevice(id);
  }

  @Post('sync-all')
  async syncAllDevices() {
    return this.devicesService.syncAllDevices();
  }

  @Post(':id/test')
  async testConnection(@Param('id') id: string) {
    return this.devicesService.testConnection(id);
  }

  @Post('test-connection')
  async testConnectionParams(@Body() body: any) {
    return this.devicesService.testConnectionParams(body);
  }
}
