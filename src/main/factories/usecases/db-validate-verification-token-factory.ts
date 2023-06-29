import env from '@/main/config/env'
import { type ValidateVerificationToken } from '@/domain/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { DbValidateVerificationToken } from '@/data/use-cases'

export const makeDbValidateVerificationToken = (): ValidateVerificationToken => {
  const salt = Number(env.salt)
  const guardianRepository = new GuardianAccountRepository()
  const hashService = new BcryptAdapter(salt)
  const validateVerificationToken = new DbValidateVerificationToken({
    guardianRepository,
    hashService
  })
  return validateVerificationToken
}
