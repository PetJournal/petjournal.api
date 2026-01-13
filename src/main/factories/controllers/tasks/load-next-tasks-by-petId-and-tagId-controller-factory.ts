import { LoadNextTaskByPetIdAndTagIdController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { makeDbLoadNextTasksByPetIdAndTagId } from '../../usecases'
import { makeLoadNextTasksByPetIdAndTagIdValidation } from '../../validations/tasks'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'

export const makeLoadNextTasksByPetIdAndTagIdController = (): Controller => {
  const loadNextTasksByPetIdAndTagId = makeDbLoadNextTasksByPetIdAndTagId()
  const validation = makeLoadNextTasksByPetIdAndTagIdValidation()
  const dependencies: LoadNextTaskByPetIdAndTagIdController.Dependencies = {
    loadNextTasksByPetIdAndTagId,
    validation
  }
  const controller = new LoadNextTaskByPetIdAndTagIdController(dependencies)

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(controller, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
