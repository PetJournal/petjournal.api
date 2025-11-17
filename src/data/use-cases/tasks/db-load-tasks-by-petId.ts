import { type LoadTasksByPetId } from '@/domain/use-cases'
import { type LoadTasksByPetIdRepository } from '@/data/protocols'

export class DbLoadTasksByPetId implements LoadTasksByPetId {
  constructor (
    private readonly eventRepository: LoadTasksByPetIdRepository
  ) {}

  async load ({ petId, page, limit }: LoadTasksByPetId.Params): Promise<LoadTasksByPetId.Result> {
    return await this.eventRepository.loadByPetId({
      petId,
      page,
      limit
    })
  }
}
