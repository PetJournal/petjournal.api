import { type Controller } from '@/application/protocols'
import { ChangePasswordController } from '@/application/controllers'
import { DbChangePassword } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { PasswordValidatorAdapter } from '@/infra/validators'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
import env from '@/main/config/env'

export const makeChangePasswordController = (): Controller => {
  const salt = Number(env.salt)
  const guardianRepository = new GuardianAccountRepository()
  const hashService = new BcryptAdapter(salt)
  const changePassword = new DbChangePassword({ hashService, guardianRepository })
  const loggerPgRepository = new LoggerPgRepository()
  const passwordValidator = new PasswordValidatorAdapter()
  const changePasswordController = new ChangePasswordController({ changePassword, passwordValidator })
  return new LoggerControllerDecorator(changePasswordController, loggerPgRepository)
}
