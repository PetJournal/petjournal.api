export interface LoadEventByDateRepository {
  loadByDate: (params: LoadEventByDateRepository.Params) => Promise<LoadEventByDateRepository.Result>
}

export namespace LoadEventByDateRepository {
  export type Params = {
    date: Date
    schedulerId: string
  }

  export type Result = {
    schedulerId: string
    start: Date
    end: Date
  } | null
}
