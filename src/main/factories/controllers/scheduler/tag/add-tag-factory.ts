import { AddTagController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbAddTag } from '@/main/factories/usecases'
import { makeAddTagValidation } from '@/main/factories/validations'

export const makeAddTagController = (): Controller => {
  const addTag = makeDbAddTag()
  const validation = makeAddTagValidation()
  const dependencies: AddTagController.Dependencies = {
    addTag,
    validation
  }
  const addTagController = new AddTagController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(addTagController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
