import * as redisCommands from 'redis-commands'

function createManualPromise<T>(): {
  promise: Promise<void>
  resolve?: (T) => void
  reject?: (err) => void
} {
  const result: {
    promise?: Promise<void>
    resolve?: (T) => void
    reject?: (err) => void
  } = {}

  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })

  // @ts-ignore
  return result
}

export const createRedisClientMock = (mockedCommands = {}) => {
  let lastReadPromise = createManualPromise<any>()

  const redisClientMock = {
    async publish(...events) {
      const currentReadPromise = lastReadPromise.promise

      lastReadPromise.resolve!([
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
      lastReadPromise.resolve!(undefined)
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
