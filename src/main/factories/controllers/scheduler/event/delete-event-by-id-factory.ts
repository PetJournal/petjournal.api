import { DeleteEventByIdController } from '@/application/controllers/scheduler/event/delete-event-by-id'
import { makeDbDeleteEventById } from '@/main/factories/usecases'

export const makeDeleteEventByIdController = (): DeleteEventByIdController => {
  const deleteEvent = makeDbDeleteEventById()
  const dependencies: DeleteEventByIdController.Dependencies = {
    deleteEvent
  }
  const deleteEventByIdController = new DeleteEventByIdController(dependencies)
  return deleteEventByIdController
}
