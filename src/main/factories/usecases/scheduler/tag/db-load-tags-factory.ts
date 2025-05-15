import { DbLoadTags } from '@/data/use-cases'
import { type LoadTags } from '@/domain/use-cases'
import { TagRepository } from '@/infra/repos/postgresql'

export const makeDbLoadTags = (): LoadTags => {
  const tagRepository = new TagRepository()
  const dependencies: LoadTags.Dependencies = {
    tagRepository
  }
  const dbLoadTags = new DbLoadTags(dependencies)
  return dbLoadTags
}
