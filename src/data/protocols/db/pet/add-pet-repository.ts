import { type PetGender } from '@/domain/models/pet'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'

export interface AddPetRepository {
  add: (params: AddPetRepository.Params) => Promise<AddPetRepository.Result>
}

export namespace AddPetRepository {
  export interface Params {
    guardianId: string
    specieId: string
    specieAlias?: string
    petName: string
    gender: PetGender
    breedId: string
    breedAlias: string
    sizeId: string
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
    size: SizeResultDb
  } | undefined
}
