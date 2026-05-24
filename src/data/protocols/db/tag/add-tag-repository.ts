export interface AddTagRepository {
  add: (params: AddTagRepository.Params) => Promise<AddTagRepository.Result>
}

export namespace AddTagRepository {
  export type Params = {
    guardianId: string
    name: string
    color: string
  }

  export type Result = {
    id: string
    guardianId: string
    name: string
    color: string
  } | undefined
}
