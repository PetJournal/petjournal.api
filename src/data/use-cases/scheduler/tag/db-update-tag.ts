import { NotAcceptableError } from '@/application/errors'
import { type LoadTagByIdRepository, type UpdateTagRepository } from '@/data/protocols'
import { type UpdateTag } from '@/domain/use-cases/scheduler/tag'

export class DbUpdateTag implements UpdateTag {
  private readonly tagRepository: UpdateTagRepository & LoadTagByIdRepository

  constructor ({ tagRepository }: UpdateTag.Dependencies) {
    this.tagRepository = tagRepository
  }

  async update ({ id, name, guardianId }: UpdateTag.Params): Promise<UpdateTag.Result> {
    const tag = await this.tagRepository.loadById({ guardianId, tagId: id })
    if (!tag) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      }
    }
    const tagResult = await this.tagRepository.update({ guardianId, id, name })
    return {
      isSuccess: true,
      data: tagResult
    }
  }
}
