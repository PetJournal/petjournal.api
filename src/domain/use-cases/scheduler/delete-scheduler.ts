import { type LoadGuardianByIdRepository, type DeleteSchedulerByIdRepository, type LoadSchedulerByIdRepository } from '@/data/protocols'

export interface DeleteScheduler {
  delete: (params: DeleteScheduler.Params) => Promise<DeleteScheduler.Result>
}

export namespace DeleteScheduler {
  export type Params = {
    schedulerId: string
    guardianId: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
  }

  export type Dependencies = {
    schedulerRepository: DeleteSchedulerByIdRepository & LoadSchedulerByIdRepository
    guardianRepository: LoadGuardianByIdRepository
    eventRepository: DeleteSchedulerByIdRepository
  }

}
