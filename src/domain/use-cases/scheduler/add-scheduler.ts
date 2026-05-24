import { type LoadTagByIdRepository, type AddSchedulerRepository, type AddTagRepository, type LoadPetByIdRepository, type DeleteSchedulerByIdRepository } from '@/data/protocols'
import { type EventsGenerator } from '@/data/protocols/service'
import { type ResultResponse } from '@/domain/types/result'
import { type Pet } from '@/infra/repos/postgresql/prisma/generated'

export interface AddScheduler {
  add: (params: AddScheduler.Params) => Promise<AddScheduler.Result>
}

export namespace AddScheduler {
  export type Params = {
    tagId: string
    guardianId: string
    title: string
    description: string
    note: string
    startAt: Date
    endAt: Date
    daysOfWeek?: number[]
    daysOfMonth?: number[]
    daily?: boolean
    pets: string[]
  }

  interface Data {
    id: string
    tagId: string
    guardianId: string
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

  export type Result = ResultResponse<Data>

  export type Dependencies = {
    tagRepository: AddTagRepository & LoadTagByIdRepository
    petRepository: LoadPetByIdRepository
    schedulerRepository: AddSchedulerRepository & DeleteSchedulerByIdRepository
    eventGenerator: EventsGenerator
  }
}
