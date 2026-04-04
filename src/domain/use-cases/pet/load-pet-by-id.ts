import { type LoadPetByIdRepository } from '@/data/protocols/db/pet'

export interface LoadPetById {
  loadById: (petId: LoadPetById.Params) => Promise<LoadPetById.Result>
}

export namespace LoadPetById {
  export type Params = {
    petId: string
    guardianId: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
    data?: {
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
  }

  export type Dependencies = {
    petRepository: LoadPetByIdRepository
  }
}
