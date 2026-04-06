import { DbUpdateGuardian } from '@/data/use-cases'
import { type UpdateGuardian } from '@/domain/use-cases'
import { FirebaseStorageAdapter } from '@/infra/repos/firebase'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import env from '@/main/config/env'

export const makeDbUpdateGuardian = (): UpdateGuardian => {
  const guardianRepository = new GuardianAccountRepository()
  const fileStorage = new FirebaseStorageAdapter(env.firebase.projectId, env.firebase.storageBucket, env.firebase.serviceAccount)
  const dependencies: UpdateGuardian.Dependencies = {
    guardianRepository,
    fileStorage
  }
  return new DbUpdateGuardian(dependencies)
}
