import env from '@/main/config/env'
import { type Controller } from '@/application/protocols'
import { ChangePasswordController } from '@/application/controllers'
import { BcryptAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { DbChangePassword } from '@/data/use-cases'
import { LoggerControllerDecorator } from '@/main/decorators'
import { makeChangePasswordValidation } from '@/main/factories'

export const makeChangePasswordController = (): Controller => {
  const salt = Number(env.salt)
  const loadGuardianByIdRepository = new GuardianAccountRepository()
  const updateGuardianPasswordRepository = new GuardianAccountRepository()
  const hashGenerator = new BcryptAdapter(salt)
  const changePassword = new DbChangePassword({ hashGenerator, loadGuardianByIdRepository, updateGuardianPasswordRepository })
  const loggerPgRepository = new LoggerPgRepository()
  const validation = makeChangePasswordValidation()
  const dependencies: ChangePasswordController.Dependencies = {
    changePassword,
    validation
  }
  const changePasswordController = new ChangePasswordController(dependencies)
  return new LoggerControllerDecorator(changePasswordController, loggerPgRepository)
}
