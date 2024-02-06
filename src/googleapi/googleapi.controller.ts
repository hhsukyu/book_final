import { Controller, Get, Param } from '@nestjs/common';
import { GoogleapiService } from './googleapi.service';

@Controller('googleapi')
export class GoogleapiController {
  constructor(private readonly googleapiservice: GoogleapiService) {}

  @Get('realtime/:viewId')
  async getRealtimeData(@Param('viewId') viewId: string) {
    const metrics = ['ga:pageviews']; // 가져올 메트릭을 필요에 맞게 수정해주세요

    try {
      const data = await this.googleapiservice.getRealtimeData(viewId, metrics);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
