import { type LoadTagsRepository } from '@/data/protocols'

export interface LoadTags {
  loadAll: (param: LoadTags.Param) => Promise<LoadTags.Result>
}

export namespace LoadTags {
  export type Param = string

  type Data = {
    id: string
    guardianId: string
    name: string
    color: string
  }

  export type Result = Data[]

  export type Dependencies = {
    tagRepository: LoadTagsRepository
  }
}
