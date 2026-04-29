import { NotAcceptableError } from '@/application/errors'
import { type LoadTagByIdRepository } from '@/data/protocols'
import { type LoadTagById } from '@/domain/use-cases/scheduler/tag'

export class DbLoadTagById implements LoadTagById {
  private readonly tagRepository: LoadTagByIdRepository

  constructor ({ tagRepository }: LoadTagById.Dependencies) {
    this.tagRepository = tagRepository
  }

  async loadById (params: LoadTagById.Param): Promise<LoadTagById.Result> {
    const tag = await this.tagRepository.loadById({ guardianId: params.guardianId, tagId: params.tagId })
    if (!tag) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      }
    }
    return {
      isSuccess: true,
      data: tag
    }
  }
}
