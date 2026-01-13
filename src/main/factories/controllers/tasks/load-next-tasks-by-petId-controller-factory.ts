import { LoadNextTasksByPetIdController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadNextTasksByPetId } from '@/main/factories/usecases/tasks'
import { makeLoadNextTasksByPetIdValidation } from '../../validations/tasks'

export const makeLoadNextTasksByPetIdController = (): Controller => {
  const loadNextTasksByPetId = makeLoadNextTasksByPetId()
  const validation = makeLoadNextTasksByPetIdValidation()

  const controller = new LoadNextTasksByPetIdController(
    loadNextTasksByPetId,
    validation
  )

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator =
    new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
