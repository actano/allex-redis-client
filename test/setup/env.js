
import { shutdownRedisClient } from '../../src/redis-client'

process.env.NODE_ENV = 'test'

after(() => {
  shutdownRedisClient()
})
