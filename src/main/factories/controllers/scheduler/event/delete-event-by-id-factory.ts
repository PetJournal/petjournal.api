import { DeleteEventByIdController } from '@/application/controllers/scheduler/event/delete-event-by-id'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbDeleteEventById } from '@/main/factories/usecases'

export const makeDeleteEventByIdController = (): Controller => {
  const deleteEvent = makeDbDeleteEventById()
  const dependencies: DeleteEventByIdController.Dependencies = {
    deleteEvent
  }
  const deleteEventByIdController = new DeleteEventByIdController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(deleteEventByIdController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
