import { type AddTagRepository } from '@/data/protocols'
import { type AddTag } from '@/domain/use-cases/scheduler/tag/add-tag'

export class DbAddTag implements AddTag {
  private readonly tagRepository: AddTagRepository

  constructor ({ tagRepository }: AddTag.Dependencies) {
    this.tagRepository = tagRepository
  }

  async add (tagData: AddTag.Params): Promise<AddTag.Result> {
    const tag = await this.tagRepository.add({ name: tagData.name, color: tagData.color })
    return tag
  }
}
