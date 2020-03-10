function createManualPromise() {
  const result = {}

  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}

export const createRedisClientMock = () => {
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

    async xread() {
      return await lastReadPromise.promise
    },

    disconnect() {
      lastReadPromise.resolve(undefined)
    },
  }

  return redisClientMock
}
