import { type AddTagRepository } from '@/data/protocols'

export interface AddTag {
  add: (tagData: AddTag.Params) => Promise<AddTag.Result>
}

export namespace AddTag {
  export type Params = {
    name: string
    color: string
  }

  export type Result = {
    id: string
    name: string
    color: string
  } | undefined

  export type Dependencies = {
    addTagRepository: AddTagRepository
  }
}
