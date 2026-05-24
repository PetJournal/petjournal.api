import { DbLoadCatBreeds } from '@/data/use-cases/pet/breed'
import { BreedRepository } from '@/infra/repos/postgresql'

export const makeDbLoadCatBreeds = (): DbLoadCatBreeds => {
  const breedRepository = new BreedRepository()
  const loadCatBreeds = new DbLoadCatBreeds({ breedRepository })
  return loadCatBreeds
}
