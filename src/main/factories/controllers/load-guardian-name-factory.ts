import { LoadGuardianNameController } from '@/application/controllers'
import { makeDbLoadGuardianName } from '@/main/factories/usecases'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { type Controller } from '@/application/protocols'
import { PinoAdapter } from '@/infra/log/pino-adapter'

export const makeLoadGuardianNameController = (): Controller => {
  const loadGuardianName = makeDbLoadGuardianName()
  const logger = new PinoAdapter(LoadGuardianNameController.name)
  const loadGuardianNameController = new LoadGuardianNameController({ loadGuardianName, logger })
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(loadGuardianNameController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
