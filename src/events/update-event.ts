import { strict as assert } from 'assert'
import { ZonedDateTime, ZoneOffset } from 'js-joda'
import config from '@rplan/config'
import { ChangelogEntryData, ChangelogEntryDataUpstream } from './types'
import { getRedisClient } from '../redis-client'
import { NestedPayloadError } from './errors'

const outputStreamKey = config.get('redis:output_stream_key')

function assertFlatness(earth: object) {
  for (const prop of Object.values(earth)) {
    if (typeof prop === 'object') throw new NestedPayloadError()
  }
  // I knew it, it's flat!
}

function serializeEvent(
  timestamp: string,
  userId : string,
  event: ChangelogEntryDataUpstream,
  serviceOrigin: string,
): string[] {
  /**
   * Redis only can store flat objects
   */
  if (event.payload) assertFlatness(event.payload)

  const metaData = {
    eventVersion: 'v0',
    timestamp,
    entityId: event.entityId,
    entityType: event?.entityType,
    principalId: event?.principalId,
    projectId: event?.projectId,
    taskId: event?.taskId,
    activityId: event?.activityId,
    type: event.eventType,
    userId,
    serviceOrigin,
  }

  const changelogMessage = [
    outputStreamKey, '*',
  ]

  for (const [key, value] of Object.entries(metaData)) {
    if (value != null) {
      changelogMessage.push(`meta:${key}`, value)
    }
  }

  for (const [key, value] of Object.entries(event.payload || {})) {
    changelogMessage.push(`payload:${key}`, value)
  }

  return changelogMessage
}

export async function sendPoUpdateEvent(
  userId: string,
  event: ChangelogEntryData,
  serviceOrigin: string = 'planningObjects',
) : Promise<void> {
  const redisClient = getRedisClient()
  const timestamp = ZonedDateTime.now(ZoneOffset.UTC).toString()
  const redisParams = serializeEvent(
    timestamp,
    userId,
    event,
    serviceOrigin,
  )

  assert(redisParams.length > 0, 'redis message must have key')
  const [key, ...redisPayload] = redisParams

  await redisClient.xadd(key, ...redisPayload)
}
