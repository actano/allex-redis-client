declare module "@rplan/redis-client" {
  import IORedis = require('ioredis')
  export function createNewRedisClient(): IORedis.Redis
  export function getRedisClient(): IORedis.Redis
  export function disconnectRedisClient(): void
  export function shutdownRedisClient(): void
  export function resetShutdownForTests(): void
  export interface RedisClient extends IORedis.Redis {}
}

