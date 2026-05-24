import { type Controller } from '@/application/protocols'
import { LoginController } from '@/application/controllers'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoginValidation, makeDbAuthentication } from '@/main/factories'

export const makeLoginController = (): Controller => {
  const authentication = makeDbAuthentication()
  const validation = makeLoginValidation()
  const dependencies: LoginController.Dependencies = {
    authentication,
    validation
  }
  const loginController = new LoginController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(loginController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
