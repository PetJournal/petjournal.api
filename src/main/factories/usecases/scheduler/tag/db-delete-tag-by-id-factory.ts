import { DbDeleteTagById } from '@/data/use-cases'
import { type DeleteTagById } from '@/domain/use-cases'
import { TagRepository } from '@/infra/repos/postgresql'

export const makeDbDeleteTagById = (): DeleteTagById => {
  const tagRepository = new TagRepository()
  const dependencies: DeleteTagById.Dependencies = {
    tagRepository
  }
  const dbDeleteTagById = new DbDeleteTagById(dependencies)
  return dbDeleteTagById
}
