import { LoginController } from '@/application/controllers/login'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbAuthentication } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import env from '@/main/config/env'

export const makeLoginController = (): LoginController => {
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
  return new LoginController(emailValidator, authentication)
}
