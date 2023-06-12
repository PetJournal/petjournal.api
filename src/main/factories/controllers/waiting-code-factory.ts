import { type Controller } from '@/application/protocols'
import { WaitingCodeController } from '@/application/controllers'
import { DbAuthentication } from '@/data/use-cases'
import { EmailValidatorAdapter } from '@/infra/validators'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators/logger'
import env from '@/main/config/env'

export const makeWaitingCodeController = (): Controller => {
  const salt = Number(env.salt)
  const secret = env.secret
  const emailValidator = new EmailValidatorAdapter()
  const guardianRepository = new GuardianAccountRepository()
  const hashService = new BcryptAdapter(salt)
  const tokenService = new JwtAdapter(secret)
  const authentication = new DbAuthentication({
    guardianRepository,
    hashService,
    tokenService
  })
  const loggerPgRepository = new LoggerPgRepository()
  const waitingCodeController = new WaitingCodeController({
    emailValidator,
    authentication
  })

  return new LoggerControllerDecorator(waitingCodeController, loggerPgRepository)
}
