import { prisma as db } from './prisma'
import { type LoadBreedByNameRepository } from '@/data/protocols'

export class BreedRepository implements LoadBreedByNameRepository {
  async loadByName (name: LoadBreedByNameRepository.Params): Promise<LoadBreedByNameRepository.Result> {
    const breed = await db.breed.findUnique({ where: { name } })
    if (breed) {
      return breed
    }
  }
}
