import { type Specie } from '@/domain/models/specie'

export interface AppointOtherSpecie {
  appoint: (specie: AppointOtherSpecie.Params) => Promise<AppointOtherSpecie.Result>
}

export namespace AppointOtherSpecie {
  export type Params = Specie & { id: string }

  export type Result = Specie & { id: string }

}
