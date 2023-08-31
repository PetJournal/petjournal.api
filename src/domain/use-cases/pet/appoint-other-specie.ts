import { type LoadSpecieByNameRepository } from '@/data/protocols'
import { type Specie } from '@/domain/models/specie'

export interface AppointOtherSpecie {
  appoint: (specie: AppointOtherSpecie.Params) => Promise<AppointOtherSpecie.Result>
}

export namespace AppointOtherSpecie {
  export interface Params {
    specie: Specie & { id: string }
    specieAlias: string | undefined
  }

  export interface Result {
    isSuccess: boolean
    error?: Error
    data?: {
      specieAppointed: Specie & { id: string }
      specieAlias: string | undefined
    }
  }

  export interface Dependencies {
    specieRepository: LoadSpecieByNameRepository
  }
}