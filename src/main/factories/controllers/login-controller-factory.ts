import { type Controller } from '@/application/protocols'
import { LoginController } from '@/application/controllers'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
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
  return new LoggerControllerDecorator(loginController, loggerPgRepository)
}
