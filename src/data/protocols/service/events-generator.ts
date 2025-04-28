import { type LoadEventByDateAndStartRepository, type AddEventRepository } from '../db'
import { type AddManyEventsRepository } from '../db/event/add-many-events-repository'

export interface EventsGenerator {
  generate: (params: EventsGenerator.Params) => Promise<EventsGenerator.Result>
}

export namespace EventsGenerator {
  export type Params = {
    schedulerId: string
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
      date: Date
    }> | {
      schedulerId: string
      start: Date
      end: Date
      date: Date
    }
  }
  export type Dependencies = {
    eventRepository: AddEventRepository & LoadEventByDateAndStartRepository & AddManyEventsRepository
  }
}
