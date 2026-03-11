import Redis from "ioredis";

// Cliente Redis padrão (TCP)
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Listener para log de erros
redis.on("error", (err: Error) => console.error("Redis Connection Error:", err));
