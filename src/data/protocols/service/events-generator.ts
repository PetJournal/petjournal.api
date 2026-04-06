import { type AddEventRepository, type LoadEventByDateRepository } from '../db'
import { type AddManyEventsRepository } from '../db/event/add-many-events-repository'

export interface EventsGenerator {
  generate: (params: EventsGenerator.Params) => Promise<EventsGenerator.Result>
}

export namespace EventsGenerator {
  export type Params = {
    schedulerId: string
    guardianId: string
    startAt: Date
    endAt: Date
    daysOfWeek?: number[]
    daysOfMonth?: number[]
    daily: boolean | undefined
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
    data?: Array<{
      schedulerId: string
      start: Date
      end: Date
    }> | {
      schedulerId: string
      start: Date
      end: Date
    }
  }
  export type Dependencies = {
    eventRepository: AddEventRepository & LoadEventByDateRepository & AddManyEventsRepository
  }
}
