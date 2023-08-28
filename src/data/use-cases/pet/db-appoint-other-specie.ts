import { type LoadSpecieByNameRepository } from '@/data/protocols'
import { type AppointOtherSpecie } from '@/domain/use-cases'

export class DbAppointOtherSpecie implements AppointOtherSpecie {
  private readonly specieRepository: LoadSpecieByNameRepository

  constructor ({
    specieRepository
  }: AppointOtherSpecie.Dependencies) {
    this.specieRepository = specieRepository
  }

  async appoint (params: AppointOtherSpecie.Params): Promise<AppointOtherSpecie.Result> {
    if (!params.specieAlias) {
      params.specieAlias = params.specie.name
    }
    // TODO check cases of 'other' specie
    const specieAppointed = await this.specieRepository.loadByName(params.specieAlias)
    if (!specieAppointed) {
      return {
        specieAppointed: params.specie,
        specieAlias: params.specieAlias
      }
    }
    return {
      specieAppointed,
      specieAlias: undefined
    }
  }
}
