import { type AddTagRepository } from '@/data/protocols'
import { type ResultResponse } from '@/domain/types/result'

export interface AddTag {
  add: (tagData: AddTag.Params) => Promise<AddTag.Result>
}

export namespace AddTag {
  export type Params = {
    guardianId: string
    name: string
    color: string
  }

  interface Data {
    id: string
    guardianId: string
    name: string
    color: string
  }

  export type Result = ResultResponse<Data>

  export type Dependencies = {
    tagRepository: AddTagRepository
  }
}
