import { LoadCurrentDateTasksController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadCurrentDateTasks } from '@/main/factories/usecases/tasks'
import { makeLoadCurrentDateTasksValidation } from '@/main/factories/validations/tasks'

export const makeLoadCurrentDateTasksController = (): Controller => {
  const loadCurrentDateTasks = makeLoadCurrentDateTasks()
  const validation = makeLoadCurrentDateTasksValidation()

  const controller = new LoadCurrentDateTasksController({
    loadCurrentDateTasks,
    validation
  })

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
