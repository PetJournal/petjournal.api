import { LoadCurrentMonthTasksController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadCurrentMonthTasks } from '@/main/factories/usecases/tasks'
import { makeLoadCurrentMonthTasksValidation } from '../../validations/tasks'

export const makeLoadCurrentMonthTasksController = (): Controller => {
  const loadCurrentMonthTasks = makeLoadCurrentMonthTasks()
  const validation = makeLoadCurrentMonthTasksValidation()

  const controller = new LoadCurrentMonthTasksController({
    loadCurrentMonthTasks,
    validation
  })

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
