import { type LoadGuardianByIdRepository, type DeleteEventByIdRepository, type LoadEventByIdRepository } from '@/data/protocols'

export interface DeleteEventById {
  deleteById: (params: DeleteEventById.Params) => Promise<DeleteEventById.Result>
}

export namespace DeleteEventById {
  export type Params = {
    eventId: string
    guardianId: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
  }

  export type Dependencies = {
    eventRepository: DeleteEventByIdRepository & LoadEventByIdRepository
    guardianRepository: LoadGuardianByIdRepository
  }
}
