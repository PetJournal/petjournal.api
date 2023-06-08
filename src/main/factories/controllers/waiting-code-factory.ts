import { type Controller } from '@/application/controllers/controller'
import { WaitingCodeController } from '@/application/controllers/waiting-code'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbCreateAccessToken } from '@/data/use-cases/db-create-access-token'
import { DbValidateVerificationToken } from '@/data/use-cases/db-validate-verification-token'
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
  const guardianRepository = new GuardianAccountRepository()
  const hashService = new BcryptAdapter(salt)
  const tokenService = new JwtAdapter(secret)
  const validateVerificationToken = new DbValidateVerificationToken({
    guardianRepository,
    hashService
  })
  const createAccessToken = new DbCreateAccessToken({
    loadGuardianByEmailRepository: guardianRepository,
    updateAccessTokenRepository: guardianRepository,
    hashService,
    tokenService
  })
  const loggerPgRepository = new LoggerPgRepository()
  const waitingCodeController = new WaitingCodeController({
    emailValidator,
    validateVerificationToken,
    createAccessToken
  })

  return new LoggerControllerDecorator(waitingCodeController, loggerPgRepository)
}
