import { type LoadTagByIdRepository, type UpdateTagRepository } from '@/data/protocols'

export interface UpdateTag {
  update: (params: UpdateTag.Params) => Promise<UpdateTag.Result>
}

export namespace UpdateTag {
  export type Params = {
    id: string
    guardianId: string
    name: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
    data?: UpdateTagRepository.Result
  }

  export type Dependencies = {
    tagRepository: UpdateTagRepository & LoadTagByIdRepository
  }
}
