import { type DeleteTagRepository } from '@/data/protocols'
import { type ResultResponse } from '@/domain/types/result'

export interface DeleteTagById {
  deleteById: (tagId: DeleteTagById.Param) => Promise<DeleteTagById.Result>
}

export namespace DeleteTagById {
  export type Param = string
  export type Result = ResultResponse<void>

  export type Dependencies = {
    tagRepository: DeleteTagRepository
  }
}
