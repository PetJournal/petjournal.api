import { UpdateTagController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbUpdateTag } from '@/main/factories/usecases'
import { makeUpdateTagValidation } from '@/main/factories/validations'

export const makeUpdateTagController = (): Controller => {
  const updateTag = makeDbUpdateTag()
  const validation = makeUpdateTagValidation()
  const dependencies: UpdateTagController.Dependencies = {
    updateTag,
    validation
  }
  const updateTagController = new UpdateTagController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(updateTagController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
