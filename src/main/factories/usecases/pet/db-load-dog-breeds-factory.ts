import { DbLoadDogBreeds } from '@/data/use-cases/pet/breed'
import { BreedRepository } from '@/infra/repos/postgresql'

export const makeDbLoadDogBreeds = (): DbLoadDogBreeds => {
  const breedRepository = new BreedRepository()
  const loadDogBreeds = new DbLoadDogBreeds({ breedRepository })
  return loadDogBreeds
}
