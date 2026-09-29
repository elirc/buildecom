import { ApiError } from "@/server/api/errors";
import { redis } from "@/server/cache/redis";
import "server-only";

export async function reserveIdempotencyKey(key: string, scope: string, ttlSeconds = 60 * 30) {
  const redisKey = `idempotency:${scope}:${key}`;
  const reserved = await redis.set(redisKey, "reserved", "EX", ttlSeconds, "NX");

  if (reserved !== "OK") {
    throw new ApiError("IDEMPOTENCY_REPLAY", 409, "This request is already being processed.");
  }

  return redisKey;
}

export async function completeIdempotencyKey(redisKey: string, payload: unknown, ttlSeconds = 60 * 60 * 24) {
  await redis.set(redisKey, JSON.stringify(payload), "EX", ttlSeconds);
}
