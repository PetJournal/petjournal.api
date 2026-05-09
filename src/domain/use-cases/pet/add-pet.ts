import { type FileStorage, type AddPetRepository, type LoadGuardianByIdRepository, type UpdatePetRepository } from '@/data/protocols'
import { type PetGender } from '@/domain/models/pet'
import { type AppointPet } from './appoint-pet'
import { type ResultResponse } from '@/domain/types/result'

export interface AddPet {
  add: (petData: AddPet.Params) => Promise<AddPet.Result>
}

export namespace AddPet {
  export interface Params {
    guardianId: string
    specieName: string
    petName: string
    gender: PetGender
    breedName: string
    size: string
    castrated: boolean
    dateOfBirth: Date
    image: Buffer | null
  }

  interface Data {
    id: string
    guardian: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
    }
    specie: {
      id: string
      name: string
    }
    specieAlias?: string | null
    petName: string
    gender: string
    breed: {
      id: string
      name: string
    }
    breedAlias: string
    size: {
      id: string
      name: string
    }
    castrated: boolean
    dateOfBirth: Date
    image: string
  }

  export type Result = ResultResponse<Data>

  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
    petRepository: AddPetRepository & UpdatePetRepository
    appointPet: AppointPet
    fileStorage: FileStorage
    defaultPetImageUrl: string
  }
}
