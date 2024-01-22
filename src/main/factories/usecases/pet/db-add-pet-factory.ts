import { DbAddPet } from '@/data/use-cases'
import { type AddPet } from '@/domain/use-cases'
import { GuardianAccountRepository, PetRepository } from '@/infra/repos/postgresql'
import { makeDbAppointPet } from './db-appoint-pet-factory'

export const makeDbAddPet = (): AddPet => {
  const guardianRepository = new GuardianAccountRepository()
  const petRepository = new PetRepository()
  const appointPet = makeDbAppointPet()
  const addPet = new DbAddPet({
    guardianRepository,
    petRepository,
    appointPet
  })
  return addPet
}
