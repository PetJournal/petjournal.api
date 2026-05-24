import { type Controller } from '@/application/protocols'
import { makeDbUpdateSettings } from '../../usecases'
import { makeSettingsUpdateValidation } from '../../validations/settings'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { UpdateSettingsController } from '@/application/controllers'

export const makeUpdateSettingsController = (): Controller => {
  const updateSettings = makeDbUpdateSettings()
  const validation = makeSettingsUpdateValidation()
  const dependencies: UpdateSettingsController.Dependencies = {
    updateSettings,
    validation
  }
  const updateSettingsController = new UpdateSettingsController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(updateSettingsController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
