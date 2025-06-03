import { ICacheService } from "./interfaces/ICacheService";
import { Redis } from "ioredis"; // Type for the ioredis client
// Assuming the actual redis client instance is the default export from '@/config/redis'
// This will be injected, so we don't import it here directly for instantiation,
// but the constructor will expect it.

export class RedisCacheService implements ICacheService {
  private readonly redisClient: Redis;
  private readonly defaultTTL: number = 3600; // Default TTL of 1 hour, example

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
      console.error(`Error getting cache for key ${key}:`, error);
      // In case of a parsing error or other Redis error, treat as cache miss.
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const ttl = ttlSeconds || this.defaultTTL; // Use provided TTL or default

      if (ttl > 0) { // Ensure TTL is positive, Redis 'EX' requires positive integer
        await this.redisClient.set(key, serializedValue, 'EX', ttl);
      } else {
        // If ttl is 0 or negative, some might interpret as 'set without expiry'
        // or it might be an invalid input. For simplicity, set without 'EX' if no valid TTL.
        await this.redisClient.set(key, serializedValue);
      }
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error);
      // Optionally re-throw or handle as per application requirements
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error(`Error deleting cache for key ${key}:`, error);
      // Optionally re-throw
    }
  }

  async deleteAllWithPrefix(prefix: string): Promise<void> {
    try {
      let cursor = '0';
      do {
        // Using 'SCAN' command to iterate over keys.
        // 'MATCH' specifies the pattern. `${prefix}*` means keys starting with the prefix.
        // 'COUNT' is a hint for how many keys to return per iteration.
        const [nextCursor, keys] = await this.redisClient.scan(
          cursor,
          'MATCH',
          `${prefix}*`,
          'COUNT',
          100 // Adjust count as needed
        );

        cursor = nextCursor;

        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error(`Error deleting cache for prefix ${prefix}:`, error);
      // Optionally re-throw
    }
  }
}
