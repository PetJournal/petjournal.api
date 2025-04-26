import { type LoadTagByIdRepository } from '@/data/protocols'
import { type LoadTagById } from '@/domain/use-cases/schedule/tag'

export class DbLoadTagById implements LoadTagById {
  private readonly tagRepository: LoadTagByIdRepository

  constructor ({ tagRepository }: LoadTagById.Dependencies) {
    this.tagRepository = tagRepository
  }

  async loadById (tagId: LoadTagById.Param): Promise<LoadTagById.Result> {
    const tag = await this.tagRepository.loadById(tagId)
    return tag
  }
}
