import { type LoadNextTasksByPetId } from '@/domain/use-cases'
import { type LoadNextTasksByPetIdRepository } from '@/data/protocols'

export class DbLoadNextTasksByPetId implements LoadNextTasksByPetId {
  constructor (
    private readonly eventRepository: LoadNextTasksByPetIdRepository
  ) {}

  async load ({ petId, page, limit }: LoadNextTasksByPetId.Params): Promise<LoadNextTasksByPetId.Result> {
    return await this.eventRepository.loadNextByPetId({
      petId,
      page,
      limit
    })
  }
}
