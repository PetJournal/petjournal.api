import { type LoadTagByIdRepository } from '@/data/protocols'

export interface LoadTagById {
  loadById: (tagId: LoadTagById.Param) => Promise<LoadTagById.Result>
}

export namespace LoadTagById {
  export type Param = string
  export type Result = {
    id: string
    name: string
    color: string
  } | null

  export type Dependencies = {
    tagRepository: LoadTagByIdRepository
  }
}
