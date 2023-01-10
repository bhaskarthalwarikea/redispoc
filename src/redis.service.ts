import { Logger } from '@nestjs/common';
import * as redis from 'redis';
import { promisify } from 'util';

export class RedisService {
  private static redisInstance: redis.RedisClient;
  private readonly logger = new Logger(RedisService.name);
  private constructor() {
    this.logger.log('Instance of Redis is created!');
  }

  public static async getInstance(): Promise<redis.RedisClient> {
    if (!this.redisInstance) {
      const client = redis.createClient({
        host: process.env.OI_REDIS_HOST,
        port: +process.env.OI_REDIS_PORT,
        no_ready_check: true,
        auth_pass: process.env.OI_PASSWD,
      });
      client.auth(process.env.OI_PASSWD);
      client.on('error', (error) => {
        console.log('error while creating redis client', error);
      });
      this.redisInstance = client;
    }
    return this.redisInstance;
  }

  static async setData(key: string, value: any): Promise<any> {
    const redisClient = await RedisService.getInstance();
    const setAsync = promisify(redisClient.set).bind(redisClient);
    await setAsync(key, value);
  }

  static async getData(key: string): Promise<any> {
    const redisClient = await RedisService.getInstance();
    const getAsync = promisify(redisClient.get).bind(redisClient);
    return getAsync(key);
  }

  static async deleteData(key: string): Promise<any> {
    const redisClient = await RedisService.getInstance();
    const deleteKey = promisify(redisClient.del).bind(redisClient);
    return deleteKey(key);
  }
}
