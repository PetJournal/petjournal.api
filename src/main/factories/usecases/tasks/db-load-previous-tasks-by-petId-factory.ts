import { DbLoadPreviousTasksByPetId } from '@/data/use-cases'
import { EventRepository, PetRepository } from '@/infra/repos/postgresql'

export const makeLoadPreviousTasksByPetId = (): DbLoadPreviousTasksByPetId => {
  const eventRepository = new EventRepository()
  const petRepository = new PetRepository()

  return new DbLoadPreviousTasksByPetId(
    eventRepository,
    petRepository
  )
}
