import { NotFoundError } from '@/application/errors'
import { type LoadNextTasksByPetIdAndTagIdRepository, type LoadPetByIdRepository, type LoadTagByIdRepository } from '@/data/protocols'
import { type LoadNextTasksByPetIdAndTagId } from '@/domain/use-cases'

export class DbLoadNextTasksByPetIdAndTagId implements LoadNextTasksByPetIdAndTagId {
  private readonly petRepository: LoadPetByIdRepository
  private readonly tagRepository: LoadTagByIdRepository
  private readonly eventRepository: LoadNextTasksByPetIdAndTagIdRepository

  constructor ({ petRepository, tagRepository, eventRepository }: LoadNextTasksByPetIdAndTagId.Dependencies) {
    this.petRepository = petRepository
    this.tagRepository = tagRepository
    this.eventRepository = eventRepository
  }

  async load (params: LoadNextTasksByPetIdAndTagId.Params): Promise<LoadNextTasksByPetIdAndTagId.Result> {
    const pet = await this.petRepository.loadById(params.petId)
    if (!pet) {
      return {
        isSuccess: false,
        error: new NotFoundError('petId')
      }
    }
    const tag = await this.tagRepository.loadById(params.tagId)
    if (!tag) {
      return {
        isSuccess: false,
        error: new NotFoundError('tagId')
      }
    }
    const result = await this.eventRepository.loadByPetIdAndTagId({ petId: pet.id, tagId: tag.id })
    return {
      isSuccess: true,
      data: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        events: result.events
      }
    }
  }
}
