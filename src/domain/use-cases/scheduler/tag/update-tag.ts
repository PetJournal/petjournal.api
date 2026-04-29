import { type LoadTagByIdRepository, type UpdateTagRepository } from '@/data/protocols'
import { type ResultResponse } from '@/domain/types/result'

export interface UpdateTag {
  update: (params: UpdateTag.Params) => Promise<UpdateTag.Result>
}

export namespace UpdateTag {
  export type Params = {
    id: string
    guardianId: string
    name: string
  }

  interface Data {
    id: string
    guardianId: string
    name: string
    color: string
  }

  export type Result = ResultResponse<Data | undefined>

  export type Dependencies = {
    tagRepository: UpdateTagRepository & LoadTagByIdRepository
  }
}
