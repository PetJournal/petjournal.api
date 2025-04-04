export interface LoadTagByIdRepository {
  loadById: (tagId: LoadTagByIdRepository.Param) => Promise<LoadTagByIdRepository.Result>
}

export namespace LoadTagByIdRepository {
  export type Param = string
  export type Result = {
    id: string
    name: string
    color: string
  } | null
}
