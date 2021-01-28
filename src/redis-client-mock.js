import * as redisCommands from 'redis-commands'

function createManualPromise() {
  const result = {}

  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}

export const createRedisClientMock = (mockedCommands = {}) => {
  let lastReadPromise = createManualPromise()

  const redisClientMock = {
    async publish(...events) {
      const currentReadPromise = lastReadPromise.promise

      lastReadPromise.resolve([
        [
          'mock-stream',
          [...events],
        ],
      ])
      lastReadPromise = createManualPromise()

      await currentReadPromise
    },

    async xpending() {
      return []
    },

    async xread() {
      return await lastReadPromise.promise
    },

    disconnect() {
      lastReadPromise.resolve(undefined)
    },
  }

  Object.entries(mockedCommands).forEach(([command, fn]) => {
    redisClientMock[command] = fn
  })

  redisCommands.list.forEach((command) => {
    const hasCommand = !!redisClientMock[command]

    if (hasCommand) {
      return
    }

    redisClientMock[command] = async () => {
      throw new Error(`Mocked version of "${command}" is not implemented. You have to provide your own mock or implementation.`)
    }
  })

  return redisClientMock
}
