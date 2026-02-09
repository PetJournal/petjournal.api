import { DbAddPet } from '@/data/use-cases'
import { type AddPet } from '@/domain/use-cases'
import { GuardianAccountRepository, PetRepository } from '@/infra/repos/postgresql'
import { makeDbAppointPet } from './db-appoint-pet-factory'
import { FirebaseStorageAdapter } from '@/infra/repos/firebase'
import env from '@/main/config/env'

export const makeDbAddPet = (): AddPet => {
  const guardianRepository = new GuardianAccountRepository()
  const petRepository = new PetRepository()
  const appointPet = makeDbAppointPet()
  const fileStorage = new FirebaseStorageAdapter(env.firebase.projectId, env.firebase.storageBucket)
  const defaultPetImageUrl = env.firebase.defaultPetImageUrl
  const addPet = new DbAddPet({
    guardianRepository,
    petRepository,
    appointPet,
    fileStorage,
    defaultPetImageUrl
  })
  return addPet
}
