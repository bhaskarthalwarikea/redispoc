import { Controller, Delete, Get, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(RedisService.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('pushname')
  pushName(): void {
    RedisService.setData('name', 'bhaskar');
  }

  @Get('retrievename')
  async getName(): Promise<string> {
    const name = await RedisService.getData('name');
    if (!name) {
      RedisService.setData('name', 'bhaskar');
    }
    return name;
  }

  @Delete('deletename')
  deleteName(): void {
    RedisService.deleteData('name');
  }
}
