import { type LoadTagByIdRepository } from '@/data/protocols'

export interface LoadTagById {
  loadById: (params: LoadTagById.Param) => Promise<LoadTagById.Result>
}

export namespace LoadTagById {
  export type Param = {
    tagId: string
    guardianId: string
  }
  export type Result = {
    id: string
    guardianId: string
    name: string
    color: string
  } | null

  export type Dependencies = {
    tagRepository: LoadTagByIdRepository
  }
}
