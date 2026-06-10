import { DbDeleteEventById } from '@/data/use-cases/scheduler/event/db-delete-event-by-id'
import { type DeleteEventById } from '@/domain/use-cases'
import { EventRepository, GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbDeleteEventById = (): DeleteEventById => {
  const eventRepository = new EventRepository()
  const guardianRepository = new GuardianAccountRepository()
  const dependencies: DeleteEventById.Dependencies = {
    eventRepository,
    guardianRepository
  }
  const deleteEvent = new DbDeleteEventById(dependencies)
  return deleteEvent
}
