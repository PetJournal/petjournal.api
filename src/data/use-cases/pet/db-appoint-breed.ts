import { type LoadBreedByNameRepository } from '@/data/protocols'
import { type Breed } from '@/domain/models/breed'
import { type AppointBreed } from '@/domain/use-cases'

export class DbAppointBreed implements AppointBreed {
  private readonly breedRepository: LoadBreedByNameRepository

  constructor ({ breedRepository }: AppointBreed.Dependencies) {
    this.breedRepository = breedRepository
  }

  async appoint (breedName: AppointBreed.Params): Promise<AppointBreed.Result> {
    const breed = await this.breedRepository.loadByName(breedName)
    if (!breed) {
      const otherBreed = await this.breedRepository.loadByName('Outros')
      return {
        breed: otherBreed as Breed & { id: string },
        breedAlias: breedName
      }
    }
    if (breed.name === 'Outros') {
      return {
        breed,
        breedAlias: 'Outros'
      }
    }
    return {
      breed,
      breedAlias: ''
    }
  }
}
