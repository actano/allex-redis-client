import { PoType } from '@rplan/allex-planning-object-types'
import { strict as assert } from 'assert'
import { ZonedDateTime, ZoneOffset } from 'js-joda'
import config from '@rplan/config'
import { ChangelogEntryData, ChangelogEntryDataUpstream, ChangelogEventTypes } from './types'
import { getRedisClient } from '../redis-client'
import { NestedPayloadError } from './errors'

const outputStreamKey = config.get('redis:output_stream_key')

function assertFlatness(earth: object) {
  for (const prop of Object.values(earth)) {
    if (typeof prop === 'object') throw new NestedPayloadError()
  }
  // I knew it, it's flat!
}

/**
 * Redis only can store flat objects
 */
function serializeEvent(
  timestamp: string,
  entityId : string,
  entityType : PoType,
  eventType : ChangelogEventTypes,
  payload : object,
  userId : string,
  principalId? : string,
  projectId? : string,
  taskId? : string,
  activityId? : string,
): string[] {
  if (payload) assertFlatness(payload)

  const metaData = {
    eventVersion: 'v0',
    timestamp,
    entityId,
    entityType,
    principalId,
    projectId,
    taskId,
    activityId,
    type: eventType,
    userId,
    serviceOrigin: 'planningObjects',
  }

  const changelogMessage = [
    outputStreamKey, '*',
  ]

  for (const [key, value] of Object.entries(metaData)) {
    if (value != null) {
      changelogMessage.push(`meta:${key}`, value)
    }
  }

  for (const [key, value] of Object.entries(payload || {})) {
    changelogMessage.push(`payload:${key}`, value)
  }

  return changelogMessage
}

export async function sendPoUpdateEvent(
  userId: string,
  event: ChangelogEntryData,
) : Promise<void> {
  const redisClient = getRedisClient()
  const timestamp = ZonedDateTime.now(ZoneOffset.UTC).toString()
  // use synced model to make typescript happy
  const data = event as ChangelogEntryDataUpstream
  const redisParams = serializeEvent(
    timestamp,
    data.entityId,
    data.entityType,
    data.eventType,
    data.payload,
    userId,
    data.principalId,
    data?.projectId,
    data?.taskId,
    data?.activityId,
  )

  assert(redisParams.length > 0, 'redis message must have key')
  const [key, ...redisPayload] = redisParams

  await redisClient.xadd(key, ...redisPayload)
}
