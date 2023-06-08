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
  const loadGuardianByIdRepository = new GuardianAccountRepository()
  const updateGuardianPasswordRepository = new GuardianAccountRepository()
  const hashGenerator = new BcryptAdapter(salt)
  const changePassword = new DbChangePassword({ hashGenerator, loadGuardianByIdRepository, updateGuardianPasswordRepository })
  const loggerPgRepository = new LoggerPgRepository()
  const passwordValidator = new PasswordValidatorAdapter()
  const changePasswordController = new ChangePasswordController({ changePassword, passwordValidator })
  return new LoggerControllerDecorator(changePasswordController, loggerPgRepository)
}
