import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(private readonly database: DatabaseService) {}

  @Public()
  @Get('health')
  async health() {
    try {
      await this.database.ping();
      return {
        status: 'ok',
        database: 'connected',
        databaseProvider: this.database.provider,
        version: process.env.APP_VERSION ?? '0.0.1-dev',
        commit: process.env.APP_GIT_SHA ?? 'local',
        buildNumber: process.env.APP_BUILD_NUMBER ?? 'local',
        builtAt: process.env.APP_BUILT_AT ?? 'unknown',
        environment: process.env.APP_ENVIRONMENT ?? 'development',
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'degraded',
        database: 'disconnected',
        databaseProvider: this.database.provider,
      });
    }
  }
}
