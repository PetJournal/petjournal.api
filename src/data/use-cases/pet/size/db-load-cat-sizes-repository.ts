import { type LoadCatSizesRepository } from '@/data/protocols/db/size/load-cat-sizes-repository'
import { type LoadCatSizes } from '@/domain/use-cases/pet/size/load-cat-sizes'

export class DbLoadCatSizesRepository implements LoadCatSizes {
  private readonly sizeRepository: LoadCatSizesRepository

  constructor ({ sizeRepository }: LoadCatSizes.Dependencies) {
    this.sizeRepository = sizeRepository
  }

  async load (): Promise<LoadCatSizes.Result> {
    return await this.sizeRepository.loadCatSizes()
  }
}
