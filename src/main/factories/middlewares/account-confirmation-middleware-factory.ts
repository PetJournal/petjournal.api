import { AccountConfirmationMiddleware } from '@/application/middlewares/account-confirmation'
import { type Middleware } from '@/application/protocols'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'

export const makeAccountConfirmationMiddlware = (): Middleware => {
  const guardianRepository = new GuardianAccountRepository()
  const accountConfirmationMiddleware = new AccountConfirmationMiddleware({ guardianRepository })
  const loggerErrorRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(accountConfirmationMiddleware, loggerErrorRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
