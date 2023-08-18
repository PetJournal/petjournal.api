import { type LoadSpecieByNameRepository, type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type AppointOtherSpecie } from './appoint-other-specie'

export interface AddPet {
  add: (petData: AddPet.Params) => Promise<AddPet.Result>
}

export namespace AddPet {
  export interface Params {
    guardianId: string
    specieName: string
    otherAlias?: string | null
  }

  export interface Result {
    isSuccess: boolean
    error?: Error
    data?: AddPetRepository.Result
  }

  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
    specieRepository: LoadSpecieByNameRepository
    petRepository: AddPetRepository
    appointOtherSpecie: AppointOtherSpecie
  }
}
