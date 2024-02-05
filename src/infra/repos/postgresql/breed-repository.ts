import { prisma as db } from './prisma'
import { type LoadCatBreedsRepository, type LoadBreedByNameRepository, type LoadDogBreedsRepository } from '@/data/protocols'

export class BreedRepository implements LoadBreedByNameRepository, LoadCatBreedsRepository, LoadDogBreedsRepository {
  async loadByName (name: LoadBreedByNameRepository.Params): Promise<LoadBreedByNameRepository.Result> {
    const breed = await db.breed.findUnique({ where: { name } })
    if (breed) {
      return breed
    }
  }

  async loadCatBreeds (): Promise<LoadCatBreedsRepository.Result> {
    const catBreeds = await db.breed.findMany({ where: { specie: { name: 'Gato' } } })
    if (catBreeds.length > 0) {
      return catBreeds
    }
    return []
  }

  async loadDogBreeds (): Promise<LoadDogBreedsRepository.Result> {
    const dogBreeds = await db.breed.findMany({ where: { specie: { name: 'Cachorro' } } })
    if (dogBreeds.length > 0) {
      return dogBreeds
    }
    return []
  }
}
