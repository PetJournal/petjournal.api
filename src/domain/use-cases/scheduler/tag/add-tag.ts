import { type AddTagRepository } from '@/data/protocols'

export interface AddTag {
  add: (tagData: AddTag.Params) => Promise<AddTag.Result>
}

export namespace AddTag {
  export type Params = {
    guardianId: string
    name: string
    color: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
    data?: {
      id: string
      guardianId: string
      name: string
      color: string
    }
  }

  export type Dependencies = {
    tagRepository: AddTagRepository
  }
}
