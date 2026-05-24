import { LoadPreviousTasksByPetIdController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadPreviousTasksByPetId } from '@/main/factories/usecases/tasks'
import { makeLoadPreviousTasksByPetIdValidation } from '../../validations/tasks'

export const makeLoadPreviousTasksByPetIdController = (): Controller => {
  const loadPreviousTasksByPetId = makeLoadPreviousTasksByPetId()
  const validation = makeLoadPreviousTasksByPetIdValidation()

  const controller = new LoadPreviousTasksByPetIdController(
    loadPreviousTasksByPetId,
    validation
  )

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator =
    new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
