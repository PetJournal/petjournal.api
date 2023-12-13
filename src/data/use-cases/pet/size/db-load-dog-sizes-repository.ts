import { type LoadDogSizesRepository } from '@/data/protocols/db/size/load-dog-sizes-repository'
import { type LoadDogSizes } from '@/domain/use-cases/pet/size/load-dog-sizes'

export class DbLoadDogSizesRepository implements LoadDogSizes {
  private readonly sizeRepository: LoadDogSizesRepository

  constructor ({ sizeRepository }: LoadDogSizes.Dependencies) {
    this.sizeRepository = sizeRepository
  }

  async load (): Promise<LoadDogSizes.Result> {
    return await this.sizeRepository.loadDogSizes()
  }
}
