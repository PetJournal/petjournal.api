import { DbDeletePet } from '@/data/use-cases'
import { type DeletePet } from '@/domain/use-cases'
import { GuardianAccountRepository, PetRepository } from '@/infra/repos/postgresql'

export const makeDbDeletePet = (): DeletePet => {
  const guardianRepository = new GuardianAccountRepository()
  const petRepository = new PetRepository()
  const dependencies: DeletePet.Dependencies = {
    guardianRepository,
    petRepository
  }
  const deletePet = new DbDeletePet(dependencies)
  return deletePet
}
