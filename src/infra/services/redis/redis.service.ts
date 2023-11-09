import { Injectable } from '@nestjs/common';
import {
  RedisService as RedisS,
  DEFAULT_REDIS_NAMESPACE,
} from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { SysConfigService } from '../config/sys.config.service';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  constructor(
    private readonly redisService: RedisS,
    private readonly sysConfigService: SysConfigService,
  ) {
    this.redis = this.redisService.getClient();
  }
  async set(
    key: string,
    value: string,
    expireTime: number = this.sysConfigService.infra.redisExpire,
  ): Promise<boolean> {
    try {
      const result = await this.redis.set(key, value, 'EX', expireTime);
      return result === 'OK';
    } catch (error) {
      console.error(`Redis set error: ${error}`);
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const result = await this.redis.get(key);
      return result;
    } catch (error) {
      console.error(`Redis get error: ${error}`);
      return null;
    }
  }
}
