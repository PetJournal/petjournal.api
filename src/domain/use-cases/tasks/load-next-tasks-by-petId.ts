import { type LoadNextTasksByPetIdRepository } from '@/data/protocols'

export interface LoadNextTasksByPetId {
  load: (params: LoadNextTasksByPetId.Params) => Promise<LoadNextTasksByPetId.Result>
}

export namespace LoadNextTasksByPetId {
  export type Params = {
    guardianId: string
    petId: string
    page?: number
    limit?: number
  }

  export type Result =
    {
      isSuccess: boolean
      data?: LoadNextTasksByPetIdRepository.Result
      error?: Error
    }

  export type Dependencies = {
    eventRepository: LoadNextTasksByPetIdRepository
  }
}
