import { DbLoadNextTasksByPetId } from '@/data/use-cases'
import { EventRepository, PetRepository } from '@/infra/repos/postgresql'

export const makeLoadNextTasksByPetId = (): DbLoadNextTasksByPetId => {
  const eventRepository = new EventRepository()
  const petRepository = new PetRepository()

  return new DbLoadNextTasksByPetId(
    eventRepository,
    petRepository
  )
}
