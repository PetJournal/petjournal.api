import { prisma as db } from '@/infra/repos/postgresql/prisma'

import { type LoadCatBreedsRepository } from '@/data/protocols'

export class BreedRepository implements LoadCatBreedsRepository {
  async loadCatBreeds (): Promise<LoadCatBreedsRepository.Result> {
    const catBreeds = await db.breed.findMany()
    if (catBreeds) {
      return catBreeds
    }
  }
}
