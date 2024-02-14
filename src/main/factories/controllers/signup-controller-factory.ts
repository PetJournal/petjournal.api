import { type Controller } from '@/application/protocols'
import { SignUpController } from '@/application/controllers'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeSignUpValidation, makeDbAddGuardian } from '@/main/factories'

export const makeSignUpController = (): Controller => {
  const addGuardian = makeDbAddGuardian()
  const validation = makeSignUpValidation()
  const signUpController = new SignUpController(addGuardian, validation)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(signUpController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
