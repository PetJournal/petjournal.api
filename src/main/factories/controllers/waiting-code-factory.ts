import env from '@/main/config/env'
import { type Controller } from '@/application/protocols'
import { WaitingCodeController } from '@/application/controllers'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators/logger'
import { makeWaitingCodeValidation } from '@/main/factories'
import { DbAuthentication } from '@/data/use-cases'

export const makeWaitingCodeController = (): Controller => {
  const salt = Number(env.salt)
  const secret = env.secret
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
  const validation = makeWaitingCodeValidation()
  const loggerPgRepository = new LoggerPgRepository()
  const waitingCodeController = new WaitingCodeController({
    authentication,
    validation
  })
  return new LoggerControllerDecorator(waitingCodeController, loggerPgRepository)
}
