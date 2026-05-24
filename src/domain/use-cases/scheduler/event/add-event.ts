import { type AddEventRepository } from '@/data/protocols'

export interface AddEvent {
  add: (params: AddEvent.Params) => Promise<AddEvent.Result>
}

export namespace AddEvent {
  export type Params = {
    schedulerId: string
    start: Date
    end: Date
    date: Date
  }

  type Data = {
    id: string
    schedulerId: string
    start: Date
    end: Date
    date: Date
  }

  export type Result = Data | undefined

  export type Dependencies = {
    eventRepository: AddEventRepository
  }
}
