
import Redis from 'ioredis'
import createLogger from '@rplan/logger'
import config from '@rplan/config'
import Bluebird from 'bluebird'
import { createRedisClientMock, RedisClientMock } from './redis-client-mock'

// @ts-ignore
Redis.Promise = Bluebird
let redisClient: Redis.Redis | RedisClientMock | null = null
let isShutdown = false

const logger = createLogger('redis-client')

export function createNewRedisClient(): Redis.Redis {
  let client

  if (config.get('redis:sentinel:enabled')) {
    client = new Redis({
      sentinels: config.get('redis:sentinel:instances'),
      name: config.get('redis:sentinel:masterGroupName'),
      maxRetriesPerRequest: config.get('redis:maxRetries'),
      password: config.get('redis:password'),
    })
  } else {
    client = new Redis({
      host: config.get('redis:host'),
      port: config.get('redis:port'),
      maxRetriesPerRequest: config.get('redis:maxRetries'),
      password: config.get('redis:password'),
    })
  }

  client
    .on('connect', () => {
      logger.info('Connecting to Redis')
    })
    .on('ready', () => {
      logger.info('Successfully connected to Redis')
    })
    .on('error', (err) => {
      logger.error({ err }, 'Error while connecting to redis')
    })
    .on('close', () => {
      logger.info('Connection to Redis was closed')
    })
    .on('reconnecting', () => {
      logger.info('Redis is trying to reconnect')
    })

  return client
}

/*
* We want to re-use a single redis client in production to not reconnect all the time
*/
export function getRedisClient() {
  if (isShutdown) {
    throw new Error('redis client has been shut down')
  }

  if (!redisClient) redisClient = createNewRedisClient()

  return redisClient as Redis.Redis
}

export function getRedisClientMock() {
  if (isShutdown) {
    throw new Error('redis client has been shut down')
  }

  if (!redisClient) redisClient = createRedisClientMock()

  return redisClient as RedisClientMock
}


export const disconnectRedisClient = () => {
  if (redisClient) {
    redisClient.disconnect()
    redisClient = null
    logger.info('redis client has been disconnected')
  }
}

export function shutdownRedisClient() {
  isShutdown = true
  disconnectRedisClient()
}

export function resetShutdownForTests() {
  isShutdown = false
}
