import { ServerError } from '@/application/errors'
import { type AddTagRepository } from '@/data/protocols'
import { type AddTag } from '@/domain/use-cases/scheduler/tag/add-tag'

export class DbAddTag implements AddTag {
  private readonly tagRepository: AddTagRepository

  constructor ({ tagRepository }: AddTag.Dependencies) {
    this.tagRepository = tagRepository
  }

  async add (tagData: AddTag.Params): Promise<AddTag.Result> {
    const tag = await this.tagRepository.add({ guardianId: tagData.guardianId, name: tagData.name, color: tagData.color })
    if (!tag) {
      return {
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      }
    }
    return {
      isSuccess: true,
      data: tag
    }
  }
}
