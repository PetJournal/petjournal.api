import { type Controller } from '@/application/protocols'
import { ChangePasswordController } from '@/application/controllers'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { makeChangePasswordValidation, makeDbChangePassword } from '@/main/factories'

export const makeChangePasswordController = (): Controller => {
  const changePassword = makeDbChangePassword()
  const validation = makeChangePasswordValidation()
  const dependencies: ChangePasswordController.Dependencies = {
    changePassword,
    validation
  }
  const changePasswordController = new ChangePasswordController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(changePasswordController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
