import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbForgetCodeAuthentication } from '@/data/use-cases/db-forget-code-authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'

import env from '@/main/config/env'

export const makeWaitingCodeController = (): WaitingCodeController => {
  const salt = Number(env.salt)
  const emailValidator = new EmailValidatorAdapter()
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const hashComparer = new BcryptAdapter(salt)
  const forgetCodeAuthentication = new DbForgetCodeAuthentication({
    loadGuardianByEmailRepository,
    hashComparer
  })

  return new WaitingCodeController({
    emailValidator,
    forgetCodeAuthentication
  })
}
