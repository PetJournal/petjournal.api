import { prisma as db } from './prisma'
import { type LoadDogSizesRepository, type LoadCatSizesRepository, type LoadSizeByNameRepository } from '@/data/protocols/db/size'

export class SizeRepository implements LoadSizeByNameRepository, LoadCatSizesRepository, LoadDogSizesRepository {
  async loadByName (name: LoadSizeByNameRepository.Params): Promise<LoadSizeByNameRepository.Result> {
    const size = await db.size.findUnique({ where: { name } })
    if (size) {
      return size
    }
  }

  async loadCatSizes (): Promise<LoadCatSizesRepository.Result> {
    const sizes = await db.size.findMany({ where: { specie: { name: 'Gato' } } })
    if (sizes) {
      return sizes
    }
  }

  async loadDogSizes (): Promise<LoadDogSizesRepository.Result> {
    const sizes = await db.size.findMany({ where: { specie: { name: 'Cachorro' } } })
    if (sizes) {
      return sizes
    }
  }
}
