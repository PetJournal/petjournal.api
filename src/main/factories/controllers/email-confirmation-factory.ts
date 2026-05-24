import { type Controller } from '@/application/protocols'
import { makeDbEmailConfirmation } from '../usecases'
import { EmailConfirmationController } from '@/application/controllers'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'

export const makeEmailConfirmationController = (): Controller => {
  const emailConfirmation = makeDbEmailConfirmation()
  const emailConfirmationController = new EmailConfirmationController({ emailConfirmation })
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(emailConfirmationController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
