import { DbLoadTagById } from '@/data/use-cases/schedule/tag/db-load-tag-by-id'
import { type LoadTagById } from '@/domain/use-cases'
import { TagRepository } from '@/infra/repos/postgresql'

export const makeDbLoadTagById = (): LoadTagById => {
  const tagRepository = new TagRepository()
  const dependencies: LoadTagById.Dependencies = {
    tagRepository
  }
  const dbLoadTagById = new DbLoadTagById(dependencies)
  return dbLoadTagById
}
