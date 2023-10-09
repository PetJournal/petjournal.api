import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type AppointSpecie } from './appoint-specie'

export interface AddPet {
  add: (petData: AddPet.Params) => Promise<AddPet.Result>
}

export namespace AddPet {
  export interface Params {
    guardianId: string
    specieName: string
  }

  export interface Result {
    isSuccess: boolean
    error?: Error
    data?: AddPetRepository.Result
  }

  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
    petRepository: AddPetRepository
    appointSpecie: AppointSpecie
  }
}
