import { type LoadNextTasksByPetIdRepository } from '@/data/protocols'
import { type PageResult } from '@/domain/types/page-result'

export interface LoadNextTasksByPetId {
  load: (params: LoadNextTasksByPetId.Params) => Promise<LoadNextTasksByPetId.Result>
}

export namespace LoadNextTasksByPetId {
  export type Params = {
    petId: string
    page?: number
    limit?: number
  }

  type Event = {
    id: string
    start: Date
    end: Date
    schedulerId: string
    scheduler: {
      id: string
      title: string
      description: string
      note: string
      startAt: Date
      endAt: Date
      daysOfWeek: number[]
      daysOfMonth: number[]
      daily: boolean
      tag: {
        name: string
        color: string
      }
      pets: Array<{
        id: string
        image: string
      }>
    }
  }

  export type Result = PageResult<Event, 'nextEvents'>

  export type Dependencies = {
    eventRepository: LoadNextTasksByPetIdRepository
  }
}
