import { DbLoadNextTasksByPetIdAndTagId } from '@/data/use-cases'
import { type LoadNextTasksByPetIdAndTagId } from '@/domain/use-cases'
import { EventRepository, PetRepository, TagRepository } from '@/infra/repos/postgresql'

export const makeDbLoadNextTasksByPetIdAndTagId = (): DbLoadNextTasksByPetIdAndTagId => {
  const petRepository = new PetRepository()
  const tagRepository = new TagRepository()
  const eventRepository = new EventRepository()
  const dependencies: LoadNextTasksByPetIdAndTagId.Dependencies = {
    petRepository,
    tagRepository,
    eventRepository
  }
  const dbLoadNextTasksByPetIdAndTagId = new DbLoadNextTasksByPetIdAndTagId(dependencies)
  return dbLoadNextTasksByPetIdAndTagId
}
