import { type DeletePetByIdRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository } from '@/data/protocols'

export interface DeletePet {
  delete: (params: DeletePet.Params) => Promise<DeletePet.Result>
}

export namespace DeletePet {

  export type Params = {
    guardianId: string
    petId: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
  }

  export type Dependencies = {
    guardianRepository: LoadGuardianByIdRepository
    petRepository: LoadPetByIdRepository & DeletePetByIdRepository
  }
}
