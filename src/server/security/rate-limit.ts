import { ApiError } from "@/server/api/errors";
import { redis } from "@/server/cache/redis";
import "server-only";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export async function enforceRateLimit({ key, limit, windowSeconds }: RateLimitOptions) {
  const redisKey = `rate-limit:${key}`;
  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, windowSeconds);
  }

  if (count > limit) {
    throw new ApiError("RATE_LIMITED", 429, "Too many requests. Please retry later.");
  }

  return {
    remaining: Math.max(0, limit - count),
    limit,
    resetSeconds: await redis.ttl(redisKey)
  };
}
