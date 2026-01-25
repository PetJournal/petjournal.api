import { type ResultResponse } from '@/domain/types/result'
import { type AddEventRepository, type LoadEventByDateRepository } from '../db'
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

  type Data = {
    schedulerId: string
    start: Date
    end: Date
  }

  export type Result = ResultResponse<Data[] | Data>
  export type Dependencies = {
    eventRepository: AddEventRepository & LoadEventByDateRepository & AddManyEventsRepository
  }
}
