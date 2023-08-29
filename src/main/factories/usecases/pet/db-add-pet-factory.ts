import { DbAddPet } from '@/data/use-cases'
import { type AddPet } from '@/domain/use-cases'
import { GuardianAccountRepository, PetRepository, SpecieRepository } from '@/infra/repos/postgresql'
import { makeDbAppointOtherSpecie } from './db-appoint-other-specie-factory'

export const makeDbAddPet = (): AddPet => {
  const guardianRepository = new GuardianAccountRepository()
  const petRepository = new PetRepository()
  const specieRepository = new SpecieRepository()
  const appointOtherSpecie = makeDbAppointOtherSpecie()
  const addPet = new DbAddPet({
    guardianRepository,
    petRepository,
    specieRepository,
    appointOtherSpecie
  })
  return addPet
}
