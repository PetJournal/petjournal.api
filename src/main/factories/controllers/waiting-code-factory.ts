import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbForgetCodeAuthentication } from '@/data/use-cases/db-forget-code-authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'

import env from '@/main/config/env'

export const makeWaitingCodeController = (): WaitingCodeController => {
  const salt = Number(env.salt)
  const secret = env.secret
  const emailValidator = new EmailValidatorAdapter()
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const hasher = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(secret)
  const forgetCodeAuthentication = new DbForgetCodeAuthentication({
    loadGuardianByEmailRepository,
    hashComparer: hasher,
    hashGenerator: hasher,
    tokenGenerator
  })

  return new WaitingCodeController({
    emailValidator,
    forgetCodeAuthentication
  })
}
