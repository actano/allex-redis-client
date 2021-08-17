
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import { shutdownRedisClient } from '../../src/redis-client'

chai.use(chaiAsPromised)
chai.use(sinonChai)

process.env.NODE_ENV = 'test'

after(() => {
  shutdownRedisClient()
})
