import { type LoadPreviousTasksByPetIdRepository } from '@/data/protocols/db/task/load-previous-task-by-petId-repository'
import { type PageResult } from '@/domain/types/page-result'

export interface LoadPreviousTasksByPetId {
  load: (params: LoadPreviousTasksByPetId.Params) => Promise<LoadPreviousTasksByPetId.Result>
}

export namespace LoadPreviousTasksByPetId {
  export type Params = {
    guardianId: string
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

  export type Result = PageResult<Event, 'history'>

  export type Dependencies = {
    eventRepository: LoadPreviousTasksByPetIdRepository
  }
}
