import { DbLoadPetById } from '@/data/use-cases'
import { type LoadPetById } from '@/domain/use-cases'
import { PetRepository } from '@/infra/repos/postgresql'

export const makeDbLoadPetById = (): LoadPetById => {
  const petRepository = new PetRepository()
  const dependencies: LoadPetById.Dependencies = {
    petRepository
  }
  return new DbLoadPetById(dependencies)
}
