const CACHE_DURATION = 60 * 1000;
const cache = new Map();

export function getCachedData(key) {
  const cached = cache.get(key);
  if (!cached) {
    console.log(`Cache miss: ${key}`);
    return null;
  }

  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    console.log(`Cache expired: ${key}`);
    cache.delete(key);
    return null;
  }

  console.log(`Cache hit: ${key}`);
  return cached.data;
}

export function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
  console.log(`Cache set: ${key}`);
}

export function clearCacheEntry(key) {
  cache.delete(key);
  console.log(`Cache cleared: ${key}`);
}

export function clearAllCache() {
  cache.clear();
  console.log("All cache cleared");
}

export function getCacheStats() {
  const stats = {
    totalEntries: cache.size,
    entries: [],
  };

  cache.forEach((value, key) => {
    const age = Date.now() - value.timestamp;
    const isExpired = age > CACHE_DURATION;
    stats.entries.push({
      key,
      age: Math.round(age / 1000),
      expired: isExpired,
    });
  });

  return stats;
}

export function cleanupExpiredCache() {
  let cleaned = 0;
  cache.forEach((value, key) => {
    if (Date.now() - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
      cleaned++;
    }
  });
  console.log(`Cleaned ${cleaned} expired cache entries`);
  return cleaned;
}

export function getCacheTimeRemaining(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  const elapsed = Date.now() - cached.timestamp;
  const remaining = Math.max(0, CACHE_DURATION - elapsed);
  return Math.round(remaining / 1000);
}
