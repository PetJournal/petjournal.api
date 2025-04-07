import { type Tag } from '@/domain/models'

export interface LoadTagsRepository {
  loadAll: () => Promise<LoadTagsRepository.Result>
}

export namespace LoadTagsRepository {
  export type Result = Tag[]
}
