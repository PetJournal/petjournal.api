import { type LoadPetByIdRepository } from '@/data/protocols/db/pet'

export interface LoadPetById {
  loadById: (petId: LoadPetById.Params) => Promise<LoadPetById.Result>
}

export namespace LoadPetById {
  export type Params = {
    petId: string
  }

  export type Result = {
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
  } | null

  export type Dependencies = {
    petRepository: LoadPetByIdRepository
  }
}
