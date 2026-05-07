import { Body, Controller, Headers, Post } from '@nestjs/common';
import { FingerticService } from './fingertic.service';

@Controller('biometric/fingertic')
export class FingerticController {
  constructor(private readonly fingerticService: FingerticService) {}

  @Post('webhook')
  async handleWebhook(
    @Headers('x-device-token') deviceToken: string,
    @Body() payload: unknown,
  ) {
    return this.fingerticService.handleWebhook(deviceToken, payload);
  }
}
