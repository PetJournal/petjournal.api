import { LoadTagsController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbLoadTags } from '@/main/factories/usecases'

export const makeLoadTagsController = (): Controller => {
  const loadTags = makeDbLoadTags()
  const dependencies: LoadTagsController.Dependencies = {
    loadTags
  }
  const loadTagsController = new LoadTagsController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(loadTagsController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
