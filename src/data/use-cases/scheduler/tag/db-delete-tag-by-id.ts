import { NotFoundError } from '@/application/errors'
import { type DeleteTagRepository } from '@/data/protocols'
import { type DeleteTagById } from '@/domain/use-cases/scheduler/tag'

export class DbDeleteTagById implements DeleteTagById {
  private readonly tagRepository: DeleteTagRepository

  constructor ({ tagRepository }: DeleteTagById.Dependencies) {
    this.tagRepository = tagRepository
  }

  async deleteById (params: DeleteTagById.Param): Promise<DeleteTagById.Result> {
    const tag = await this.tagRepository.deleteById({ tagId: params.tagId, guardianId: params.guardianId })
    if (!tag) {
      return {
        isSuccess: false,
        error: new NotFoundError('tagId')
      }
    }
    return {
      isSuccess: true
    }
  }
}
