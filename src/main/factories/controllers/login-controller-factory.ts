import { LoginController } from '@/application/controllers/login'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbAuthentication } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import env from '@/main/config/env'

export const makeLoginController = (): LoginController => {
  const salt = Number(env.salt)
  const secret = env.secret
  const hashComparer = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(secret)
  const emailValidator = new EmailValidatorAdapter()
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const updateAccessTokenRepository = new GuardianAccountRepository()
  const authentication = new DbAuthentication({ loadGuardianByEmailRepository, hashComparer, tokenGenerator, updateAccessTokenRepository })
  return new LoginController(emailValidator, authentication)
}
