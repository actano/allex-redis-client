declare module "@rplan/redis-client" {
  import IORedis = require('ioredis')
  export interface RedisClient extends IORedis.Redis {}
  export function createNewRedisClient(): RedisClient
  export function getRedisClient(): RedisClient
  export function disconnectRedisClient(): void
  export function shutdownRedisClient(): void
  export function resetShutdownForTests(): void
}

