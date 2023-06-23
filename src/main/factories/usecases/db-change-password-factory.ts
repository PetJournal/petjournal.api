import env from '@/main/config/env'
import { type ChangePassword } from '@/domain/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { DbChangePassword } from '@/data/use-cases'

export const makeDbChangePassword = (): ChangePassword => {
  const salt = Number(env.salt)
  const guardianRepository = new GuardianAccountRepository()
  const hashService = new BcryptAdapter(salt)
  const changePassword = new DbChangePassword({
    hashService,
    guardianRepository
  })
  return changePassword
}
