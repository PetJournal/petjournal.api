import { type AppointOtherSpecie } from '@/domain/use-cases'

export class DbAppointOtherSpecie implements AppointOtherSpecie {
  async appoint (params: AppointOtherSpecie.Params): Promise<AppointOtherSpecie.Result> {
    return {
      specieAppointed: params.specie,
      specieAlias: undefined
    }
  }
}
