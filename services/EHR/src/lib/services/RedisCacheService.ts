import { ICacheService } from './interfaces/ICacheService';
import { Redis } from 'ioredis';

export class RedisCacheService implements ICacheService {
  private readonly redisClient: Redis;
  private readonly defaultTTL: number = 3600; // Default TTL of 1 hour

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting cache for key ${key} from Redis:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const ttl = ttlSeconds || this.defaultTTL;

      if (ttl > 0) {
        await this.redisClient.set(key, serializedValue, 'EX', ttl);
      } else {
        await this.redisClient.set(key, serializedValue);
      }
    } catch (error) {
      console.error(`Error setting cache for key ${key} in Redis:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error(`Error deleting cache for key ${key} from Redis:`, error);
    }
  }

  async deleteAllWithPrefix(prefix: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.redisClient.scan(
          cursor,
          'MATCH',
          `${prefix}*`,
          'COUNT',
          100
        );

        cursor = nextCursor;

        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error(
        `Error deleting cache for prefix ${prefix} from Redis:`,
        error
      );
    }
  }
}
