import { type AddTagRepository } from '@/data/protocols'
import { type AddTag } from '@/domain/use-cases/schedule/tag/add-tag'

export class DbAddTag implements AddTag {
  private readonly addTagRepository: AddTagRepository

  constructor ({ addTagRepository }: AddTag.Dependencies) {
    this.addTagRepository = addTagRepository
  }

  async add (tagData: AddTag.Params): Promise<AddTag.Result> {
    const tag = await this.addTagRepository.add({ name: tagData.name, color: tagData.color })
    return tag
  }
}
