export interface LoadTasksByDateRepository {
  loadByDate: (params: LoadTasksByDateRepository.Params) => Promise<LoadTasksByDateRepository.Result>
}

export namespace LoadTasksByDateRepository {
  export type Params = {
    start: Date
    end: Date
  }

  export type Result = Array<{
    id: string
    schedulerId: string
    start: Date
    end: Date
  }>
}
