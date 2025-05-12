import { DbUpdateTag } from '@/data/use-cases'
import { type UpdateTag } from '@/domain/use-cases'
import { TagRepository } from '@/infra/repos/postgresql'

export const makeUpdateTag = (): DbUpdateTag => {
  const tagRepository = new TagRepository()
  const dependencies: UpdateTag.Dependencies = {
    tagRepository
  }
  const dbUpdateTag = new DbUpdateTag(dependencies)
  return dbUpdateTag
}
