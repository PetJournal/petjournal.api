import { LoadTagByIdController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbLoadTagById } from '@/main/factories/usecases'

export const makeLoadTagByIdController = (): Controller => {
  const loadTag = makeDbLoadTagById()
  const dependencies: LoadTagByIdController.Dependencies = {
    loadTag
  }
  const loadTagByIdController = new LoadTagByIdController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(loadTagByIdController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
