
export interface LoadTagsRepository {
  loadAll: (param: LoadTagsRepository.Param) => Promise<LoadTagsRepository.Result>
}

export namespace LoadTagsRepository {
  export type Param = string
  export type Result = Array<{
    id: string
    guardianId: string
    name: string
    color: string
  }>
}
