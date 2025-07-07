import { LoadCurrentDateTasksController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadCurrentDateTasks } from '@/main/factories/usecases/tasks'

export const makeLoadCurrentDateTasksController = (): Controller => {
  const loadCurrentDateTasks = makeLoadCurrentDateTasks()

  const controller = new LoadCurrentDateTasksController({
    loadCurrentDateTasks
  })

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
