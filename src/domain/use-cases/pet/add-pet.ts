import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type AppointSpecie } from './appoint-specie'
import { type PetGender } from '@/domain/models/Pet'

export interface AddPet {
  add: (petData: AddPet.Params) => Promise<AddPet.Result>
}

export namespace AddPet {
  export interface Params {
    guardianId: string
    specieName: string
    petName: string
    gender: PetGender
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
