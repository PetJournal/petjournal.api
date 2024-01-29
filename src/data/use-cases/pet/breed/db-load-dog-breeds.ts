import { type LoadDogBreedsRepository } from '@/data/protocols'
import { type LoadDogBreeds } from '@/domain/use-cases'

export class DbLoadDogBreeds implements LoadDogBreeds {
  private readonly breedRepository: LoadDogBreedsRepository

  constructor ({ breedRepository }: LoadDogBreeds.Dependencies) {
    this.breedRepository = breedRepository
  }

  async load (): Promise<LoadDogBreeds.Result> {
    return await this.breedRepository.loadDogBreeds()
  }
}
