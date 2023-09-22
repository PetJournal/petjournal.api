import { InvalidParamError } from '@/application/errors'
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
    if (params.specie.name === 'Outros' && !params.specieAlias) {
      return {
        isSuccess: false,
        error: new InvalidParamError('specieAlias')
      }
    }
    if (!params.specieAlias) {
      params.specieAlias = params.specie.name
    }
    const specieAppointed = await this.specieRepository.loadByName(params.specieAlias)
    if (!specieAppointed) {
      return {
        isSuccess: true,
        data: {
          specieAppointed: params.specie,
          specieAlias: params.specieAlias
        }
      }
    }
    return {
      isSuccess: true,
      data: {
        specieAppointed,
        specieAlias: undefined
      }
    }
  }
}
