import { type Controller } from '@/application/protocols'
import { ForgetPasswordController } from '@/application/controllers'
import { LoggerControllerDecorator } from '@/main/decorators'
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
  return new LoggerControllerDecorator(forgetPasswordController, loggerPgRepository)
}
