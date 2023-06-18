import env from '@/main/config/env'
import { type AddGuardian } from '@/domain/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { DbAddGuardian } from '@/data/use-cases'

export const makeDbAddGuardian = (): AddGuardian => {
  const salt = Number(env.salt)
  const hashGenerator = new BcryptAdapter(salt)
  const addGuardianRepository = new GuardianAccountRepository()
  const addGuardian = new DbAddGuardian({ addGuardianRepository, hashGenerator })
  return addGuardian
}
