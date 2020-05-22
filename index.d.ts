declare module "@rplan/redis-client" {
  import Redis = require('ioredis')
  export function createNewRedisClient(): Redis
  export function getRedisClient(): Redis
  export function disconnectRedisClient(): void
  export function shutdownRedisClient(): void
  export function resetShutdownForTests(): void
}

