import { DeleteTagByIdController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbDeleteTagById } from '@/main/factories/usecases'

export const makeDeleteTagByIdController = (): Controller => {
  const deleteTag = makeDbDeleteTagById()
  const dependencies: DeleteTagByIdController.Dependencies = {
    deleteTag
  }
  const deleteTagByIdController = new DeleteTagByIdController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(deleteTagByIdController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
