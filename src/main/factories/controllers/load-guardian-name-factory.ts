import { LoadGuardianNameController } from '@/application/controllers'
import { makeDbLoadGuardianName } from '@/main/factories/usecases'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { type Controller } from '@/application/protocols'

export const makeLoadGuardianNameController = (): Controller => {
  const loadGuardianName = makeDbLoadGuardianName()
  const loadGuardianNameController = new LoadGuardianNameController({ loadGuardianName })
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(loadGuardianNameController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
