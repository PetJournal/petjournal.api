import { type LoadPetByIdRepository } from '@/data/protocols/db/pet'
import { type ResultResponse } from '@/domain/types/result'

export interface LoadPetById {
  loadById: (petId: LoadPetById.Params) => Promise<LoadPetById.Result>
}

export namespace LoadPetById {
  export type Params = {
    petId: string
  }

  interface Data {
    id: string
    guardianId: string
    specie: {
      id: string
      name: string
    }
    specieAlias: string | null
    petName: string
    gender: string
    breedAlias: string
    breed: {
      id: string
      name: string
    }
    size: {
      id: string
      name: string
    }
    castrated: boolean
    dateOfBirth: Date
    image: string
  }

  export type Result = ResultResponse<Data>

  export type Dependencies = {
    petRepository: LoadPetByIdRepository
  }
}
