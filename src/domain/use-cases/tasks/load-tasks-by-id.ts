import { type LoadTasksByPetIdRepository } from '@/data/protocols/db/task/load-task-by-pet-repository'

export interface LoadTasksByPetId {
  load: (params: LoadTasksByPetId.Params) => Promise<LoadTasksByPetId.Result>
}

export namespace LoadTasksByPetId {
  export type Params = {
    petId: string
    page?: number
    limit?: number
  }

  export type Result = LoadTasksByPetIdRepository.Result
}
