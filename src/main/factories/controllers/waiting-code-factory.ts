import { type Controller } from '@/application/protocols'
import { WaitingCodeController } from '@/application/controllers'
import { EmailValidatorAdapter } from '@/application/validation'
import { DbAuthentication } from '@/data/use-cases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators/logger'
import env from '@/main/config/env'

export const makeWaitingCodeController = (): Controller => {
  const salt = Number(env.salt)
  const secret = env.secret
  const emailValidator = new EmailValidatorAdapter()
  const repository = new GuardianAccountRepository()
  const hasher = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(secret)
  const authentication = new DbAuthentication({
    loadGuardianByEmailRepository: repository,
    updateAccessTokenRepository: repository,
    hashComparer: hasher,
    hashGenerator: hasher,
    tokenGenerator
  })
  const loggerPgRepository = new LoggerPgRepository()
  const waitingCodeController = new WaitingCodeController({
    emailValidator,
    authentication
  })

  return new LoggerControllerDecorator(waitingCodeController, loggerPgRepository)
}
