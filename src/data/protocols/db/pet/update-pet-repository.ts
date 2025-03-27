import { type PetGender } from '@/domain/models/pet'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'

export interface UpdatePetRepository {
  update: (params: UpdatePetRepository.Params) => Promise<UpdatePetRepository.Result>
}

export namespace UpdatePetRepository {
  export interface Params {
    guardianId: string
    petId: string
    specieId?: string
    breedId?: string
    sizeId?: string
    specieAlias?: string
    breedAlias?: string
    petName?: string
    gender?: PetGender
    castrated?: boolean
    dateOfBirth?: Date
    image?: string
  }

  type GuardianResultDb = Pick<Guardian, 'firstName' | 'lastName' | 'email' | 'phone'> & {
    id: string
  }

  type SpecieResultDb = Specie & {
    id: string
  }

  type BreedResultDb = Breed & {
    id: string
  }

  type SizeResultDb = Size & {
    id: string
  }

  export type Result = {
    id: string
    guardian: GuardianResultDb
    specie: SpecieResultDb
    specieAlias?: string | null
    petName: string
    gender: string
    breed: BreedResultDb
    breedAlias: string
    size: SizeResultDb
    castrated: boolean
    dateOfBirth: Date
    image: string
  } | undefined
}
