import { SignUpController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbAddGuardian, makeDbSendEmail, makeSignUpValidation } from '@/main/factories'

export const makeSignUpController = (): Controller => {
  const addGuardian = makeDbAddGuardian()
  const validation = makeSignUpValidation()
  const sendEmail = makeDbSendEmail()
  const dependencies: SignUpController.Dependencies = {
    addGuardian,
    validation,
    sendEmail
  }
  const signUpController = new SignUpController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(signUpController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
