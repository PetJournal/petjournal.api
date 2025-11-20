import { type LoadPreviousTasksByPetId } from '@/domain/use-cases'
import { type LoadPreviousTasksByPetIdRepository } from '@/data/protocols'

export class DbLoadPreviousTasksByPetId implements LoadPreviousTasksByPetId {
  constructor (
    private readonly eventRepository: LoadPreviousTasksByPetIdRepository
  ) {}

  async load ({ petId, page, limit }: LoadPreviousTasksByPetId.Params): Promise<LoadPreviousTasksByPetId.Result> {
    return await this.eventRepository.loadPreviousByPetId({
      petId,
      page,
      limit
    })
  }
}
