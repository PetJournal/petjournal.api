import { type Controller } from '@/application/protocols'
import { LoginController } from '@/application/controllers'
import { EmailValidatorAdapter } from '@/application/validation'
import { DbAuthentication } from '@/data/use-cases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
import env from '@/main/config/env'

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
  const emailValidator = new EmailValidatorAdapter()
  const loginController = new LoginController({ emailValidator, authentication })
  return new LoggerControllerDecorator(loginController, loggerPgRepository)
}
