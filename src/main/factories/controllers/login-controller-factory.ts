import { type Controller } from '@/application/protocols'
import { LoginController } from '@/application/controllers/login'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbAuthentication } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { LoggerPgRepository } from '@/infra/repos/postgresql/logger-repository'
import env from '@/main/config/env'
import { LoggerControllerDecorator } from '@/main/decorators'

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
