import { type Controller } from '@/application/protocols'
import { SignUpController } from '@/application/controllers'
import { EmailValidatorAdapter, NameValidatorAdapter, PasswordValidatorAdapter, PhoneValidatorAdapter } from '@/application/validation'
import { DbAddGuardian } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql/logger-repository'
import env from '@/main/config/env'

export const makeSignUpController = (): Controller => {
  const salt = Number(env.salt)
  const hashGenerator = new BcryptAdapter(salt)
  const addGuardianRepository = new GuardianAccountRepository()
  const addGuardian = new DbAddGuardian({ addGuardianRepository, hashGenerator })
  const loggerPgRepository = new LoggerPgRepository()
  const emailValidator = new EmailValidatorAdapter()
  const nameValidator = new NameValidatorAdapter()
  const passwordValidator = new PasswordValidatorAdapter()
  const phoneValidator = new PhoneValidatorAdapter()
  const signUpController = new SignUpController({
    addGuardian,
    emailValidator,
    nameValidator,
    passwordValidator,
    phoneValidator
  })
  return new LoggerControllerDecorator(signUpController, loggerPgRepository)
}
