import { type UpdatePetRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository, type FileStorage, type DeleteFileStorage } from '@/data/protocols'
import { type PetGender } from '@/domain/models/pet'
import { type AppointPet } from './appoint-pet'

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

  export interface Result {
    isSuccess: boolean
    error?: Error
    data?: UpdatePetRepository.Result
  }

  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
    petRepository: UpdatePetRepository & LoadPetByIdRepository
    appointPet: AppointPet
    fileStorage: FileStorage & DeleteFileStorage
  }
}
