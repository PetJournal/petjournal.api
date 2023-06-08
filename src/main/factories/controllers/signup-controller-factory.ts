import env from '@/main/config/env'
import { type Controller } from '@/application/protocols'
import { SignUpController } from '@/application/controllers'
import { DbAddGuardian } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
import { makeSignUpValidation } from '@/main/factories'

export const makeSignUpController = (): Controller => {
  const salt = Number(env.salt)
  const hashGenerator = new BcryptAdapter(salt)
  const addGuardianRepository = new GuardianAccountRepository()
  const addGuardian = new DbAddGuardian({ addGuardianRepository, hashGenerator })
  const loggerPgRepository = new LoggerPgRepository()
  const validation = makeSignUpValidation()
  const dependencies: SignUpController.Dependencies = {
    addGuardian,
    validation
  }
  const signUpController = new SignUpController(dependencies)
  return new LoggerControllerDecorator(signUpController, loggerPgRepository)
}
