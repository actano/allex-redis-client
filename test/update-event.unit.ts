import { expect } from 'chai'
import sinon from 'sinon'
import { ZonedDateTime } from 'js-joda'
import config from '@rplan/config'
import { PoType } from '@rplan/allex-planning-object-types'

import * as redisClient from '../src/redis-client'
import { ChangelogEventTypes } from '../src/events/types'
import { sendPoUpdateEvent } from '../src/events/update-event'
import { NestedPayloadError } from '../src/events/errors'

const streamKey = config.get('redis:output_stream_key')

describe('send messages to redis', () => {
  const timestamp = '2016-03-18T12:38:23.561+01:00'
  const entityId = '1234'
  const projectId = '5678'
  const principalId = '8765'
  const eventType = ChangelogEventTypes.UPDATE
  const payload = {
    key1: 'value1',
    key2: 'value2',
  }
  const userId = 'user1'
  const taskId = 'task1'
  const activityId = 'activity1'

  let sandbox
  let redisMock
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    redisMock = {
      xadd: sandbox.stub(),
    }
    sandbox.stub(redisClient, 'getRedisClient').returns(redisMock)
    sandbox.stub(ZonedDateTime, 'now').returns(ZonedDateTime.parse(timestamp))
  })
  afterEach(() => {
    sandbox.restore()
  })

  context('successfully send a message', () => {
    it('should send a message to redis with the right parameters', async () => {
      await sendPoUpdateEvent(
        userId,
        {
          entityId,
          entityType: PoType.Task,
          eventType,
          payload,
          principalId,
          projectId,
          taskId,
          activityId,
        },
      )
      expect(redisMock.xadd).to.have.been.calledWithExactly(
        streamKey, '*',
        'meta:eventVersion', 'v0',
        'meta:timestamp', timestamp,
        'meta:entityId', entityId,
        'meta:entityType', PoType.Task,
        'meta:principalId', principalId,
        'meta:projectId', projectId,
        'meta:taskId', taskId,
        'meta:activityId', activityId,
        'meta:type', eventType,
        'meta:userId', userId,
        'meta:serviceOrigin', 'planningObjects',
        'payload:key1', 'value1',
        'payload:key2', 'value2',
      )
    })
    it('should not send projectId, taskId and activityId if not present', async () => {
      await sendPoUpdateEvent(
        userId,
        // @ts-ignore
        {
          entityId,
          eventType,
          principalId,
          projectId,
          entityType: PoType.Project,
          payload,
        },
      )
      expect(redisMock.xadd).to.have.been.calledWithExactly(
        streamKey, '*',
        'meta:eventVersion', 'v0',
        'meta:timestamp', timestamp,
        'meta:entityId', entityId,
        'meta:entityType', PoType.Project,
        'meta:principalId', principalId,
        'meta:projectId', projectId,
        'meta:type', eventType,
        'meta:userId', userId,
        'meta:serviceOrigin', 'planningObjects',
        'payload:key1', 'value1',
        'payload:key2', 'value2',
      )
    })
    it('should not send payload if none was passed', async () => {
      await sendPoUpdateEvent(
        userId,
        {
          entityId,
          eventType,
          principalId,
          projectId,
          // @ts-ignore
          entityType: PoType.Project,
          // @ts-ignore
          payload: undefined,
        },
      )
      expect(redisMock.xadd).to.have.been.calledWithExactly(
        streamKey, '*',
        'meta:eventVersion', 'v0',
        'meta:timestamp', timestamp,
        'meta:entityId', entityId,
        'meta:entityType', PoType.Project,
        'meta:principalId', principalId,
        'meta:projectId', projectId,
        'meta:type', eventType,
        'meta:userId', userId,
        'meta:serviceOrigin', 'planningObjects',
      )
    })
  })
  context('nested payload', () => {
    it('should fail', async () => {
      const invalidPayload = {
        thats: { just: { too: { deep: 1 } } },
      }

      const p = sendPoUpdateEvent(
        userId,
        {
          entityId,
          entityType: PoType.Task,
          eventType,
          principalId,
          taskId,
          projectId,
          payload: invalidPayload,
        },
      )
      await expect(p).to.eventually.be.rejectedWith(NestedPayloadError)
      expect(redisMock.xadd).to.not.have.been.called
    })
  })
})
