import { type Controller } from '@/application/protocols'
import { ChangePasswordController } from '@/application/controllers'
import { PasswordValidatorAdapter } from '@/application/validation'
import { DbChangePassword } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql/logger-repository'
import env from '@/main/config/env'

export const makeChangePasswordController = (): Controller => {
  const salt = Number(env.salt)
  const loadGuardianByIdRepository = new GuardianAccountRepository()
  const updateGuardianPasswordRepository = new GuardianAccountRepository()
  const hashGenerator = new BcryptAdapter(salt)
  const changePassword = new DbChangePassword({ hashGenerator, loadGuardianByIdRepository, updateGuardianPasswordRepository })
  const loggerPgRepository = new LoggerPgRepository()
  const passwordValidator = new PasswordValidatorAdapter()
  const changePasswordController = new ChangePasswordController({ changePassword, passwordValidator })
  return new LoggerControllerDecorator(changePasswordController, loggerPgRepository)
}
