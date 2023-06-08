import env from '@/main/config/env'
import { type Controller } from '@/application/protocols'
import { LoginController } from '@/application/controllers'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
import { makeLoginValidation } from '@/main/factories'
import { DbAuthentication } from '@/data/use-cases'

export const makeLoginController = (): Controller => {
  const salt = Number(env.salt)
  const secret = env.secret
  const hashGenerator = new BcryptAdapter(salt)
  const hashComparer = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(secret)
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const updateAccessTokenRepository = new GuardianAccountRepository()
  const authentication = new DbAuthentication({ loadGuardianByEmailRepository, hashGenerator, hashComparer, tokenGenerator, updateAccessTokenRepository })
  const loggerPgRepository = new LoggerPgRepository()
  const validation = makeLoginValidation()
  const dependencies: LoginController.Dependencies = {
    validation,
    authentication
  }
  const loginController = new LoginController(dependencies)
  return new LoggerControllerDecorator(loginController, loggerPgRepository)
}
