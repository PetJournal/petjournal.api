import { type LoadTagByIdRepository, type AddEventRepository, type AddSchedulerRepository, type AddTagRepository, type LoadPetByIdRepository } from '@/data/protocols'
import { type EventsGenerator } from '@/data/protocols/service'
import { type Pet } from '@prisma/client'

export interface AddScheduler {
  add: (params: AddScheduler.Params) => Promise<AddScheduler.Result>
}

export namespace AddScheduler {
  export type Params = {
    tagId: string
    title: string
    description: string
    note: string
    startAt: Date
    endAt: Date
    daysOfWeek?: number[]
    daysOfMonth?: number[]
    daily: boolean
    pets: string[]
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
    data?: {
      id: string
      tagId: string
      title: string
      description: string
      note: string
      startAt: Date
      endAt: Date
      daysOfWeek?: number[]
      daysOfMonth?: number[]
      daily: boolean
      pets: Pet[]
    }
  }

  export type Dependencies = {
    tagRepository: AddTagRepository & LoadTagByIdRepository
    petRepository: LoadPetByIdRepository
    eventRepository: AddEventRepository
    schedulerRepository: AddSchedulerRepository
    eventGenerator: EventsGenerator
  }
}
