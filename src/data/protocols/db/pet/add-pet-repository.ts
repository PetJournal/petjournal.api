import { type PetGender } from '@/domain/models/Pet'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'

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
  }

  type GuardianResultDb = Pick<Guardian, 'firstName' | 'lastName' | 'email' | 'phone'> & {
    id: string
  }

  type SpecieResultDb = Specie & {
    id: string
  }

  export type Result = {
    id: string
    guardian: GuardianResultDb
    specie: SpecieResultDb
    specieAlias?: string | null
    petName: string
    gender: string
  } | undefined
}
