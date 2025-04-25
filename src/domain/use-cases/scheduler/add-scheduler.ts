import { type AddEventRepository, type AddSchedulerRepository, type AddTagRepository } from '@/data/protocols'
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
    daysOfWeek: number[]
    daysOfMonth: number[]
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
    pets: Pet[]
  } | undefined

  export type Dependencies = {
    tagRepository: AddTagRepository
    eventRepository: AddEventRepository
    schedulerRepository: AddSchedulerRepository
    eventGenerator: EventsGenerator
  }
}
