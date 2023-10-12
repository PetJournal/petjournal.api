import { DbAddPet } from '@/data/use-cases'
import { type AddPet } from '@/domain/use-cases'
import { GuardianAccountRepository, PetRepository } from '@/infra/repos/postgresql'
import { makeDbAppointSpecie } from './db-appoint-specie-factory'

export const makeDbAddPet = (): AddPet => {
  const guardianRepository = new GuardianAccountRepository()
  const petRepository = new PetRepository()
  const appointSpecie = makeDbAppointSpecie()
  const addPet = new DbAddPet({
    guardianRepository,
    petRepository,
    appointSpecie
  })
  return addPet
}
