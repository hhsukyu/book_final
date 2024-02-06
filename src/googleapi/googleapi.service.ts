import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleapiService {
  private readonly auth;

  constructor(private readonly configService: ConfigService) {
    this.auth = new google.auth.GoogleAuth({
      keyFile: `${this.configService.get('KEYFILE')}`,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
  }

  async getRealtimeData(viewId: string, metrics: string[]) {
    const analyticsreporting = google.analyticsreporting({
      version: 'v4',
      auth: await this.auth.getClient(),
    });

    const response = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId,
            metrics: metrics.map((metric) => ({ expression: metric })),
          },
        ],
      },
    });

    return response.data.reports;
  }
}
