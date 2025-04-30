import { type LoadTagsRepository } from '@/data/protocols'

export interface LoadTags {
  loadAll: () => Promise<LoadTags.Result>
}

export namespace LoadTags {
  export type Result = Array<{
    id: string
    name: string
    color: string
  }>

  export type Dependencies = {
    tagRepository: LoadTagsRepository
  }
}
