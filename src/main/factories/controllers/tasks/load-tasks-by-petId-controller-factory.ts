import { LoadTasksByPetIdController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadTasksByPetId } from '@/main/factories/usecases/tasks'
import { makeLoadTasksByPetIdValidation } from '../../validations/tasks'

export const makeLoadTasksByPetIdController = (): Controller => {
  const loadTasksByPetId = makeLoadTasksByPetId()
  const validation = makeLoadTasksByPetIdValidation()

  const controller = new LoadTasksByPetIdController({
    loadTasksByPetId,
    validation
  })

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
