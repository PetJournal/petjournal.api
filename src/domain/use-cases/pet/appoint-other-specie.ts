import { type Specie } from '@/domain/models/specie'

export interface AppointOtherSpecie {
  appoint: (specie: AppointOtherSpecie.Params) => Promise<AppointOtherSpecie.Result>
}

export namespace AppointOtherSpecie {
  export interface Params {
    specie: Specie & { id: string }
    specieAlias: string | undefined
  }

  export type Result = Specie & { id: string }

}
