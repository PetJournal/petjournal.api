import { type LoadTagsRepository } from '@/data/protocols'
import { type LoadTags } from '@/domain/use-cases/schedule/tag'

export class DbLoadTags implements LoadTags {
  private readonly tagRepository: LoadTagsRepository

  constructor ({ tagRepository }: LoadTags.Dependencies) {
    this.tagRepository = tagRepository
  }

  async loadAll (): Promise<LoadTags.Result> {
    const tags = await this.tagRepository.loadAll()
    return tags
  }
}
