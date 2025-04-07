
export interface LoadTagsRepository {
  loadAll: () => Promise<LoadTagsRepository.Result>
}

export namespace LoadTagsRepository {
  export type Result = Array<{
    id: string
    name: string
    color: string
  }>
}
