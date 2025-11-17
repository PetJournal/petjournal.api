import { DbLoadTasksByPetId } from '@/data/use-cases'
import { EventRepository } from '@/infra/repos/postgresql'

export const makeLoadTasksByPetId = (): DbLoadTasksByPetId => {
  const eventRepository = new EventRepository()
  return new DbLoadTasksByPetId(eventRepository)
}
