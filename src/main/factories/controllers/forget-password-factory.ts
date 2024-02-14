import { type Controller } from '@/application/protocols'
import { ForgetPasswordController } from '@/application/controllers'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { makeForgetPasswordValidation, makeDbForgetPassword } from '@/main/factories'

export const makeForgetPasswordController = (): Controller => {
  const forgetPassword = makeDbForgetPassword()
  const validation = makeForgetPasswordValidation()
  const dependencies: ForgetPasswordController.Dependencies = {
    validation,
    forgetPassword
  }
  const forgetPasswordController = new ForgetPasswordController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(forgetPasswordController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
