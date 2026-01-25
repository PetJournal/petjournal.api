import { type LoadNextTasksByPetIdAndTagIdRepository, type LoadPetByIdRepository, type LoadTagByIdRepository } from '@/data/protocols'
import { type PageResult } from '@/domain/types/page-result'

export interface LoadNextTasksByPetIdAndTagId {
  load: (params: LoadNextTasksByPetIdAndTagId.Params) => Promise<LoadNextTasksByPetIdAndTagId.Result>
}

export namespace LoadNextTasksByPetIdAndTagId {
  export type Params = {
    petId: string
    tagId: string
    page?: number
    limit?: number
  }

  type Data = {
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

  export type Result = PageResult<Data, 'events'>

  export type Dependencies = {
    eventRepository: LoadNextTasksByPetIdAndTagIdRepository
    petRepository: LoadPetByIdRepository
    tagRepository: LoadTagByIdRepository
  }
}
