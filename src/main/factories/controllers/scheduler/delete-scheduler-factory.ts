import { type Controller } from '@/application/protocols'
import { makeDbDeleteScheduler } from '../../usecases'
import { makeDeleteSchedulerValidation } from '../../validations'
import { DeleteSchedulerController } from '@/application/controllers'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'

export const makeDeleteSchedulerController = (): Controller => {
  const deleteScheduler = makeDbDeleteScheduler()
  const validation = makeDeleteSchedulerValidation()
  const dependencies: DeleteSchedulerController.Dependencies = {
    deleteScheduler,
    validation
  }
  const deleteSchedulerController = new DeleteSchedulerController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(deleteSchedulerController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
