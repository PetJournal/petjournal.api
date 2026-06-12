import { type LoadGuardianByIdRepository, type DeleteEventByIdRepository, type LoadEventByIdRepository } from '@/data/protocols'
import { type ResultResponse } from '@/domain/types/result'

export interface DeleteEventById {
  deleteById: (params: DeleteEventById.Params) => Promise<DeleteEventById.Result>
}

export namespace DeleteEventById {
  export type Params = {
    eventId: string
    guardianId: string
  }

  export type Result = ResultResponse<undefined>

  export type Dependencies = {
    eventRepository: DeleteEventByIdRepository & LoadEventByIdRepository
    guardianRepository: LoadGuardianByIdRepository
  }
}
