import { type LoadPetByGuardianIdRepository } from '@/data/protocols/db/pet'

export interface LoadPets {
  load: (guardianId: LoadPets.Params) => Promise<LoadPets.Result>
}

export namespace LoadPets {
  export type Params = {
    guardianId: string
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
  }

  export type Result = Data[]

  export type Dependencies = {
    petRepository: LoadPetByGuardianIdRepository
  }
}
