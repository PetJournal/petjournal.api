import { LoadCurrentMonthTasksController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { ValidationComposite } from '@/application/validation'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadCurrentMonthTasks } from '@/main/factories/usecases/tasks'

export const makeLoadCurrentMonthTasksController = (): Controller => {
  const loadCurrentMonthTasks = makeLoadCurrentMonthTasks()

  const controller = new LoadCurrentMonthTasksController({
    loadCurrentMonthTasks,
    validation: new ValidationComposite([])
  })

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
