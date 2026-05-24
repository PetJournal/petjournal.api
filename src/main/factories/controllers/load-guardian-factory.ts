import { LoadGuardianController } from '@/application/controllers'
import { makeDbLoadGuardian } from '@/main/factories/usecases'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { type Controller } from '@/application/protocols'

export const makeLoadGuardianController = (): Controller => {
  const loadGuardian = makeDbLoadGuardian()
  const loadGuardianNameController = new LoadGuardianController({ loadGuardian })
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(loadGuardianNameController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
