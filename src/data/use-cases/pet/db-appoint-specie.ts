import { type LoadSpecieByNameRepository } from '@/data/protocols'
import { type Specie } from '@/domain/models/specie'
import { type AppointSpecie } from '@/domain/use-cases'

export class DbAppointSpecie implements AppointSpecie {
  private readonly specieRepository: LoadSpecieByNameRepository

  constructor ({
    specieRepository
  }: AppointSpecie.Dependencies) {
    this.specieRepository = specieRepository
  }

  async appoint (specieName: AppointSpecie.Params): Promise<AppointSpecie.Result> {
    const specie = await this.specieRepository.loadByName(specieName)

    if (!specie) {
      const otherSpecie = await this.specieRepository.loadByName('Outros')
      return {
        specie: otherSpecie as Specie & { id: string },
        specieAlias: specieName
      }
    }

    if (specie.name === 'Outros') {
      return {
        specie,
        specieAlias: 'Outros'
      }
    }

    return {
      specie,
      specieAlias: undefined
    }
  }
}
