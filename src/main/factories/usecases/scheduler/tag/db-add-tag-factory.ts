import { DbAddTag } from '@/data/use-cases'
import { type AddTag } from '@/domain/use-cases'
import { TagRepository } from '@/infra/repos/postgresql'

export const makeDbAddTag = (): DbAddTag => {
  const tagRepository = new TagRepository()
  const dependencies: AddTag.Dependencies = {
    tagRepository
  }
  const dbAddTag = new DbAddTag(dependencies)
  return dbAddTag
}
