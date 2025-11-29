import { DbLoadNextTasksByPetId } from '@/data/use-cases'
import { EventRepository } from '@/infra/repos/postgresql'

export const makeLoadNextTasksByPetId = (): DbLoadNextTasksByPetId => {
  const eventRepository = new EventRepository()
  return new DbLoadNextTasksByPetId(eventRepository)
}
