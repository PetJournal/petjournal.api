import { type LoadEventByDateAndStartRepository, type AddEventRepository } from '../db'
import { type AddManyEventsRepository } from '../db/event/add-many-events-repository'
import { type DateToJSDate, type DateGeneratorUtc, type DateAddDay, type DateSetTime } from './date'

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
    }> | {
      schedulerId: string
      start: Date
      end: Date
    }
  }
  export type Dependencies = {
    eventRepository: AddEventRepository & LoadEventByDateAndStartRepository & AddManyEventsRepository
    dateTime: DateGeneratorUtc & DateToJSDate & DateSetTime & DateAddDay
  }
}
