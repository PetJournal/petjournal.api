import { type LoadSpecieByIdRepository, type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'

export interface AddPet {
  add: (petData: AddPet.Params) => Promise<AddPet.Result>
}

export namespace AddPet {
  export interface Params {
    guardianId: string
    specieId: string
  }

  export interface Result {
    isSuccess: boolean
    error?: Error
    id?: string
    specie?: {
      id: string
      name: string
    }
  }

  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
    specieRepository: LoadSpecieByIdRepository
    petRepository: AddPetRepository
  }
}
