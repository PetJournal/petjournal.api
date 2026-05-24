import { UpdateGuardianController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { makeDbUpdateGuardian } from '../../usecases'
import { makeUpdateGuardianValidation } from '../../validations'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'

export const makeUpdateGuardianController = (): Controller => {
  const updateGuardian = makeDbUpdateGuardian()
  const validation = makeUpdateGuardianValidation()
  const dependencies: UpdateGuardianController.Dependencies = {
    updateGuardian,
    validation
  }
  const updateGuardianController = new UpdateGuardianController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(updateGuardianController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
