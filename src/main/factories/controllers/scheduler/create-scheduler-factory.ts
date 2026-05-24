import { CreateSchedulerController } from '@/application/controllers/scheduler'
import { type Controller } from '@/application/protocols'
import { makeDbAddScheduler } from '../../usecases'
import { makeCreateSchedulerValidation } from '../../validations/scheduler'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'

export const makeCreateSchedulerController = (): Controller => {
  const addScheduler = makeDbAddScheduler()
  const validation = makeCreateSchedulerValidation()
  const dependencies: CreateSchedulerController.Dependencies = {
    addScheduler,
    validation
  }
  const createSchedulerController = new CreateSchedulerController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(createSchedulerController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
