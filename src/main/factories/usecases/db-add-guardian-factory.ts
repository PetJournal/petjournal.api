import env from '@/main/config/env'
import { type AddGuardian } from '@/domain/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { DbAddGuardian } from '@/data/use-cases'
import { FirebaseStorageAdapter } from '@/infra/repos/firebase'

export const makeDbAddGuardian = (): AddGuardian => {
  const salt = Number(env.salt)
  const hashService = new BcryptAdapter(salt)
  const guardianRepository = new GuardianAccountRepository()
  const fileStorage = new FirebaseStorageAdapter(env.firebase.projectId, env.firebase.storageBucket)
  const defaultGuardianImageUrl = env.firebase.defaultGuardianImageUrl
  const addGuardian = new DbAddGuardian({
    fileStorage,
    guardianRepository,
    hashService,
    defaultGuardianImageUrl
  })
  return addGuardian
}
