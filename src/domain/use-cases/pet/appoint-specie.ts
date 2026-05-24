import { type LoadSpecieByNameRepository } from '@/data/protocols'
import { type Specie } from '@/domain/models/specie'

export interface AppointSpecie {
  appoint: (specieName: AppointSpecie.Params) => Promise<AppointSpecie.Result>
}

export namespace AppointSpecie {
  export type Params = string

  export interface Result {
    specie: Specie & { id: string }
    specieAlias: string | undefined
  }

  export interface Dependencies {
    specieRepository: LoadSpecieByNameRepository
  }
}
