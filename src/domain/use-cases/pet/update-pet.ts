import { type UpdatePetRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository, type FileStorage, type DeleteFileStorage } from '@/data/protocols'
import { type PetGender } from '@/domain/models/pet'
import { type AppointPet } from './appoint-pet'
import { type ResultResponse } from '@/domain/types/result'
import { type Breed, type Guardian, type Size, type Specie } from '@/domain/models'

export interface UpdatePet {
  update: (petData: UpdatePet.Params) => Promise<UpdatePet.Result>
}

export namespace UpdatePet {
  export interface Params {
    guardianId: string
    petId: string
    specieName?: string
    petName?: string
    gender?: PetGender
    breedName?: string
    size?: string
    castrated?: boolean
    dateOfBirth?: Date
    image?: Buffer | null
  }

  type Data = {
    id: string
    guardian: Pick<Guardian, 'firstName' | 'lastName' | 'email' | 'phone'> & {
      id: string
    }
    specie: Specie & {
      id: string
    }
    specieAlias?: string | null
    petName: string
    gender: string
    breed: Breed & {
      id: string
    }
    breedAlias: string
    size: Size & {
      id: string
    }
    castrated: boolean
    dateOfBirth: Date
    image: string
  }

  export type Result = ResultResponse<Data | undefined>

  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
    petRepository: UpdatePetRepository & LoadPetByIdRepository
    appointPet: AppointPet
    fileStorage: FileStorage & DeleteFileStorage
  }
}
