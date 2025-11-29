import { DbLoadPreviousTasksByPetId } from '@/data/use-cases'
import { EventRepository } from '@/infra/repos/postgresql'

export const makeLoadPreviousTasksByPetId = (): DbLoadPreviousTasksByPetId => {
  const eventRepository = new EventRepository()
  return new DbLoadPreviousTasksByPetId(eventRepository)
}
