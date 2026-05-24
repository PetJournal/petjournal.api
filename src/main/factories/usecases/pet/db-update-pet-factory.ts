import { DbUpdatePet } from '@/data/use-cases'
import { type UpdatePet } from '@/domain/use-cases'
import { GuardianAccountRepository, PetRepository } from '@/infra/repos/postgresql'
import { makeDbAppointPet } from './db-appoint-pet-factory'
import { FirebaseStorageAdapter } from '@/infra/repos/firebase'
import env from '@/main/config/env'

export const makeDbUpdatePet = (): UpdatePet => {
  const guardianRepository = new GuardianAccountRepository()
  const petRepository = new PetRepository()
  const fileStorage = new FirebaseStorageAdapter(env.firebase.projectId, env.firebase.storageBucket, env.firebase.serviceAccount)
  const appointPet = makeDbAppointPet()
  const dependencies: UpdatePet.Dependencies = {
    guardianRepository,
    petRepository,
    fileStorage,
    appointPet
  }
  const updatePet = new DbUpdatePet(dependencies)
  return updatePet
}
