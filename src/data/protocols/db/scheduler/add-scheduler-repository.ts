import { type Pet } from '@/infra/repos/postgresql/prisma/generated'

export interface AddSchedulerRepository {
  add: (params: AddSchedulerRepository.Params) => Promise<AddSchedulerRepository.Result>
}

export namespace AddSchedulerRepository {
  export type Params = {
    tagId: string
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

  export type Result = {
    id: string
    tagId: string
    title: string
    description: string
    note: string
    startAt: Date
    endAt: Date
    daysOfWeek: number[]
    daysOfMonth: number[]
    daily: boolean
    pets: Pet[]
  } | undefined
}
