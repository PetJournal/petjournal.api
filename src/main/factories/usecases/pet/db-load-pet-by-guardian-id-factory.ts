import { DbLoadPetByGuardianId } from '@/data/use-cases'
import { type LoadPets } from '@/domain/use-cases'
import { PetRepository } from '@/infra/repos/postgresql'

export const makeDbLoadPetByGuardianId = (): LoadPets => {
  const petRepository = new PetRepository()
  const dependencies: LoadPets.Dependencies = {
    petRepository
  }
  return new DbLoadPetByGuardianId(dependencies)
}
