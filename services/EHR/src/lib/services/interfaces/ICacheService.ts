export interface ICacheService {
  /**
   * Retrieves a value from the cache.
   * @param key The key of the item to retrieve.
   * @returns A promise that resolves to the cached value, or null if the key is not found or an error occurs.
   *          The type T is generic to allow for type-safe retrieval.
   */
  get<T = any>(key: string): Promise<T | null>;

  /**
   * Sets a value in the cache.
   * @param key The key under which to store the value.
   * @param value The value to store.
   * @param ttlSeconds Optional. The Time-To-Live for the cache entry in seconds.
   *                   If not provided, a default TTL might be used by the implementation.
   * @returns A promise that resolves when the set operation is complete.
   */
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;

  /**
   * Deletes a value from the cache by its key.
   * @param key The key of the item to delete.
   * @returns A promise that resolves when the delete operation is complete.
   */
  delete(key: string): Promise<void>;

  /**
   * Deletes all cache entries that start with the given prefix.
   * This can be useful for invalidating groups of related cache entries.
   * @param prefix The prefix to match against cache keys.
   * @returns A promise that resolves when the delete operation is complete.
   */
  deleteAllWithPrefix?(prefix: string): Promise<void>; // Marked as optional
}
