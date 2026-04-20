import { type DeleteTagRepository } from '@/data/protocols'

export interface DeleteTagById {
  deleteById: (tagId: DeleteTagById.Param) => Promise<DeleteTagById.Result>
}

export namespace DeleteTagById {
  export type Param = {
    tagId: string
    guardianId: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
  }

  export type Dependencies = {
    tagRepository: DeleteTagRepository
  }
}
