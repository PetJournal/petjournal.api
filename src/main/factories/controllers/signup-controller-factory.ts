import { EmailValidatorAdapter, NameValidatorAdapter, PasswordValidatorAdapter, PhoneValidatorAdapter } from '@/application/validation/validators'
import { SignUpController } from '@/application/controllers/signup'
import { DbAddGuardian } from '@/data/use-cases/db-add-guardian'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { type Controller } from '@/application/controllers/controller'
import { LoggerControllerDecorator } from '@/main/decorators/logger'
import { LoggerPgRepository } from '@/infra/repos/postgresql/logger-repository'
import env from '@/main/config/env'

export const makeSignUpController = (): Controller => {
  const salt = Number(env.salt)
  const bcryptAdapter = new BcryptAdapter(salt)
  const guardianAccountRepository = new GuardianAccountRepository()
  const dbAddGuardianRepository = new DbAddGuardian(guardianAccountRepository, bcryptAdapter)
  const loggerPgRepository = new LoggerPgRepository()
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const nameValidatorAdapter = new NameValidatorAdapter()
  const passwordValidatorAdapter = new PasswordValidatorAdapter()
  const phoneValidatorAdapter = new PhoneValidatorAdapter()
  const signUpController = new SignUpController(dbAddGuardianRepository, emailValidatorAdapter, nameValidatorAdapter, passwordValidatorAdapter, phoneValidatorAdapter)
  return new LoggerControllerDecorator(signUpController, loggerPgRepository)
}
