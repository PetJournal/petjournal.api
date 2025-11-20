import { type LoadPreviousTasksByPetIdRepository } from '@/data/protocols/db/task/load-previous-task-by-petId-repository'

export interface LoadPreviousTasksByPetId {
  load: (params: LoadPreviousTasksByPetId.Params) => Promise<LoadPreviousTasksByPetId.Result>
}

export namespace LoadPreviousTasksByPetId {
  export type Params = {
    petId: string
    page?: number
    limit?: number
  }

  export type Result = LoadPreviousTasksByPetIdRepository.Result
}
