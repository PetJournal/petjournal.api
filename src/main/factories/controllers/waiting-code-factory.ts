import { type Controller } from '@/application/controllers/controller'
import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbForgetCodeAuthentication } from '@/data/use-cases/db-forget-code-authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { LoggerPgRepository } from '@/infra/repos/postgresql/logger-repository'

import env from '@/main/config/env'
import { LoggerControllerDecorator } from '@/main/decorators/logger'

export const makeWaitingCodeController = (): Controller => {
  const salt = Number(env.salt)
  const secret = env.secret
  const emailValidator = new EmailValidatorAdapter()
  const repository = new GuardianAccountRepository()
  const hasher = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(secret)
  const forgetCodeAuthentication = new DbForgetCodeAuthentication({
    loadGuardianByEmailRepository: repository,
    updateAccessTokenRepository: repository,
    hashComparer: hasher,
    hashGenerator: hasher,
    tokenGenerator
  })
  const loggerPgRepository = new LoggerPgRepository()
  const waitingCodeController = new WaitingCodeController({
    emailValidator,
    forgetCodeAuthentication
  })

  return new LoggerControllerDecorator(waitingCodeController, loggerPgRepository)
}
