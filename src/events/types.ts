import { PoType } from '@rplan/allex-planning-object-types'
import { Dictionary } from '@rplan/allex-type-helpers'

/**
 * Event domain and service origin are related but semantically different
 */
export enum EventDomain {
  // eslint-disable-next-line no-unused-vars
  PlanningObject = 'PlanningObject',
  // eslint-disable-next-line no-unused-vars
  CustomField = 'CustomField',
}

export enum ChangelogEventTypes {
  // eslint-disable-next-line no-unused-vars
  CREATE = 'create',
  // eslint-disable-next-line no-unused-vars
  UPDATE = 'update',
  // eslint-disable-next-line no-unused-vars
  COPY = 'copy',
  // eslint-disable-next-line no-unused-vars
  DELETE = 'delete',
  // eslint-disable-next-line no-unused-vars
  CONVERT = 'convert',
}

export interface ConversionChangelogEntryData {
  entityId: string,
  entityType: PoType,
  eventType: ChangelogEventTypes.CONVERT,
  payload: {
    oldEntityType: PoType,
    newEntityType: PoType,
  },
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface ProjectCreatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Project,
  eventType: ChangelogEventTypes.CREATE,
  payload: {},
  principalId: string,
  projectId: string,
}

export interface ProjectUpdatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Project,
  eventType: ChangelogEventTypes.UPDATE,
  payload: object,
  principalId: string,
  projectId: string,
}

export interface ProjectCopiedChangelogEntryData {
  entityId: string,
  entityType: PoType.Project,
  eventType: ChangelogEventTypes.COPY,
  payload: {},
  principalId: string,
  projectId: string,
}

export interface ProjectDeletedChangelogEntryData {
  entityId: string,
  entityType: PoType.Project,
  eventType: ChangelogEventTypes.DELETE,
  payload: {},
  principalId: string,
  projectId: string,
}

export interface MilestoneCreatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Milestone,
  eventType: ChangelogEventTypes.CREATE,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface MilestoneUpdatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Milestone,
  eventType: ChangelogEventTypes.UPDATE,
  payload: object,
  principalId: string,
  projectId: string,
  taskId: string,
  activityId?: string,
}

export interface MilestoneCopiedChangelogEntryData {
  entityId: string,
  entityType: PoType.Milestone,
  eventType: ChangelogEventTypes.COPY,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface MilestoneDeletedChangelogEntryData {
  entityId: string,
  entityType: PoType.Milestone,
  eventType: ChangelogEventTypes.DELETE,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface TaskCreatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Task,
  eventType: ChangelogEventTypes.CREATE,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface TaskUpdatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Task,
  eventType: ChangelogEventTypes.UPDATE,
  payload: object,
  principalId: string,
  projectId: string,
  taskId: string,
  activityId?: string,
}

export interface TaskCopiedChangelogEntryData {
  entityId: string,
  entityType: PoType.Task,
  eventType: ChangelogEventTypes.COPY,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface TaskDeletedChangelogEntryData {
  entityId: string,
  entityType: PoType.Task,
  eventType: ChangelogEventTypes.DELETE,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface SummaryCreatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Summary,
  eventType: ChangelogEventTypes.CREATE,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface SummaryUpdatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Summary,
  eventType: ChangelogEventTypes.UPDATE,
  payload: object,
  principalId: string,
  projectId: string,
  taskId: string,
  activityId?: string,
}

export interface SummaryCopiedChangelogEntryData {
  entityId: string,
  entityType: PoType.Summary,
  eventType: ChangelogEventTypes.COPY,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface SummaryDeletedChangelogEntryData {
  entityId: string,
  entityType: PoType.Summary,
  eventType: ChangelogEventTypes.DELETE,
  payload: {},
  principalId: string,
  projectId: string,
  taskId: string,
}

export interface SubtaskCreatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Subtask,
  eventType: ChangelogEventTypes.CREATE,
  payload: {},
  principalId: string,
  projectId: string | undefined,
  taskId: string,
}

export interface SubtaskUpdatedChangelogEntryData {
  entityId: string,
  entityType: PoType.Subtask,
  eventType: ChangelogEventTypes.UPDATE,
  payload: object,
  principalId: string,
  projectId: string | undefined,
  taskId: string,
}

export interface SubtaskCopiedChangelogEntryData {
  entityId: string,
  entityType: PoType.Subtask,
  eventType: ChangelogEventTypes.COPY,
  payload: {},
  principalId: string,
  projectId: string | undefined,
  taskId: string,
}

export interface SubtaskDeletedChangelogEntryData {
  entityId: string,
  entityType: PoType.Subtask,
  eventType: ChangelogEventTypes.DELETE,
  payload: {},
  principalId: string,
  projectId: string | undefined,
  taskId: string,
}

export interface StandaloneTaskCreatedChangelogEntryData {
  entityId: string,
  entityType: PoType.StandaloneTask,
  eventType: ChangelogEventTypes.CREATE,
  payload: {},
  principalId: string,
  taskId: string,
}

export interface StandaloneTaskUpdatedChangelogEntryData {
  entityId: string,
  entityType: PoType.StandaloneTask,
  eventType: ChangelogEventTypes.UPDATE,
  payload: object,
  principalId: string,
  taskId: string,
}

export interface StandaloneTaskDeletedChangelogEntryData {
  entityId: string,
  entityType: PoType.StandaloneTask,
  eventType: ChangelogEventTypes.DELETE,
  payload: object,
  principalId: string,
  taskId: string,
}

export interface UpdateCustomFieldEvent {
  entityId: string
  eventType: ChangelogEventTypes.UPDATE
  eventDomain: EventDomain.CustomField
  payload: object
}

export type ChangelogEntryData = ConversionChangelogEntryData
  | ProjectUpdatedChangelogEntryData
  | ProjectCreatedChangelogEntryData
  | ProjectCopiedChangelogEntryData
  | ProjectDeletedChangelogEntryData
  | MilestoneCreatedChangelogEntryData
  | MilestoneUpdatedChangelogEntryData
  | MilestoneCopiedChangelogEntryData
  | MilestoneDeletedChangelogEntryData
  | TaskCreatedChangelogEntryData
  | TaskUpdatedChangelogEntryData
  | TaskCopiedChangelogEntryData
  | TaskDeletedChangelogEntryData
  | SummaryCreatedChangelogEntryData
  | SummaryUpdatedChangelogEntryData
  | SummaryCopiedChangelogEntryData
  | SummaryDeletedChangelogEntryData
  | SubtaskCreatedChangelogEntryData
  | SubtaskUpdatedChangelogEntryData
  | SubtaskCopiedChangelogEntryData
  | SubtaskDeletedChangelogEntryData
  | StandaloneTaskCreatedChangelogEntryData
  | StandaloneTaskUpdatedChangelogEntryData
  | StandaloneTaskDeletedChangelogEntryData
  | UpdateCustomFieldEvent

export interface ChangelogEntryDataUpstream {
  entityId: string,
  entityType: PoType,
  eventType: ChangelogEventTypes,
  payload: object,
  principalId: string,
  projectId?: string,
  taskId?: string,
  activityId?: string,
}

export type PayloadConversionMapping = Dictionary<string>
