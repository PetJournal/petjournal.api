import { LoadSettingsController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbLoadSettings } from '@/main/factories/usecases'

export const makeLoadSettingsController = (): Controller => {
  const loadSettings = makeDbLoadSettings()
  const dependencies: LoadSettingsController.Dependencies = {
    loadSettings
  }
  const loadSettingsController = new LoadSettingsController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(loadSettingsController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
