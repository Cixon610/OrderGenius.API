import { Injectable } from '@nestjs/common';
import {
  RedisService as RedisS,
  DEFAULT_REDIS_NAMESPACE,
} from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { SysConfigService } from '../config/sys.config.service';
import { plainToInstance } from 'class-transformer';

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

  async setT<T>(
    key: string,
    value: T,
    expireTime: number = this.sysConfigService.infra.redisExpire,
  ): Promise<boolean> {
    try {
      const result = await this.redis.set(
        key,
        JSON.stringify(value),
        'EX',
        expireTime,
      );
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

  async getT<T>(key: string, type: new () => T): Promise<T | null> {
    try {
      const result = await this.redis.get(key);
      const value = JSON.parse(result);
      return plainToInstance(type, value);
    } catch (error) {
      console.error(`Redis get error: ${error}`);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis delete error: ${error}`);
      return false;
    }
  }

  // async create<T>(data: T): Promise<boolean> {
  //   try {
  //     const result = await this.redis.hmset(
  //       `${DEFAULT_REDIS_NAMESPACE}:${data.constructor.name}`,
  //       data,
  //     );
  //     return result === 'OK';
  //   } catch (error) {
  //     console.error(`Redis create error: ${error}`);
  //     return false;
  //   }
  // }

  // async update<T>(data: T): Promise<boolean> {
  //   try {
  //     const result = await this.redis.hmset(
  //       `${DEFAULT_REDIS_NAMESPACE}:${data.constructor.name}`,
  //       data,
  //     );
  //     return result === 'OK';
  //   } catch (error) {
  //     console.error(`Redis update error: ${error}`);
  //     return false;
  //   }
  // }

  // async deleteByType<T>(type: T): Promise<boolean> {
  //   try {
  //     const result = await this.redis.del(
  //       `${DEFAULT_REDIS_NAMESPACE}:${type.constructor.name}`,
  //     );
  //     return result === 1;
  //   } catch (error) {
  //     console.error(`Redis deleteByType error: ${error}`);
  //     return false;
  //   }
  // }

  // async getAll<T>(type: T): Promise<T[]> {
  //   try {
  //     const result = await this.redis.hgetall(
  //       `${DEFAULT_REDIS_NAMESPACE}:${type.constructor.name}`,
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error(`Redis getAll error: ${error}`);
  //     return [];
  //   }
  // }

  // async getById<T>(type: T, id: string): Promise<T> {
  //   try {
  //     const result = await this.redis.hget(
  //       `${DEFAULT_REDIS_NAMESPACE}:${type.constructor.name}`,
  //       id,
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error(`Redis getById error: ${error}`);
  //     return null;
  //   }
  // }

  // async getByKey<T>(type: T, key: string, value: string): Promise<T[]> {
  //   try {
  //     const result = await this.redis.hgetall(
  //       `${DEFAULT_REDIS_NAMESPACE}:${type.constructor.name}`,
  //     );
  //     return result.filter((item) => item[key] === value);
  //   } catch (error) {
  //     console.error(`Redis getByKey error: ${error}`);
  //     return [];
  //   }
  // }
}
