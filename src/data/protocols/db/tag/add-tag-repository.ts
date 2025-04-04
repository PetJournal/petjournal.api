export interface AddTagRepository {
  add: (params: AddTagRepository.Params) => Promise<AddTagRepository.Result>
}

export namespace AddTagRepository {
  export type Params = {
    name: string
    color: string
  }

  export type Result = {
    id: string
    name: string
    color: string
  } | undefined
}
