
export class NestedPayloadError extends Error {
  constructor() {
    super()
    this.name = 'NestedPayloadError'
    this.message = 'Redis does not support nested objects. We only support flat objects as payloads for this reason.'
  }
}
