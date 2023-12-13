import { type LoadCatBreedsRepository } from '@/data/protocols'
import { type LoadCatBreeds } from '@/domain/use-cases'

export class DbLoadCatBreeds implements LoadCatBreeds {
  private readonly breedRepository: LoadCatBreedsRepository

  constructor ({ breedRepository }: LoadCatBreeds.Dependencies) {
    this.breedRepository = breedRepository
  }

  async load (): Promise<LoadCatBreeds.Result> {
    return await this.breedRepository.loadCatBreeds()
  }
}
