export interface UpdateTagRepository {
  update: (param: UpdateTagRepository.Params) => Promise<UpdateTagRepository.Result>
}

export namespace UpdateTagRepository {
  export type Params = {
    id: string
    name: string
  }

  export type Result = {
    id: string
    name: string
    color: string
  } | undefined
}
