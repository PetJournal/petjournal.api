import { LoadCurrentWeekTasksController } from '@/application/controllers/tasks'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeLoadCurrentWeekTasks } from '@/main/factories/usecases/tasks'
import { makeLoadCurrentWeekTasksValidation } from '../../validations/tasks'

export const makeLoadCurrentWeekTasksController = (): Controller => {
  const loadCurrentWeekTasks = makeLoadCurrentWeekTasks()
  const validation = makeLoadCurrentWeekTasksValidation()

  const controller = new LoadCurrentWeekTasksController({
    loadCurrentWeekTasks,
    validation
  })

  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(controller, loggerPgRepository)

  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
