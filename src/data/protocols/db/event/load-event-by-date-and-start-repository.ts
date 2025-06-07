export interface LoadEventByDateAndStartRepository {
  loadByDateAndStart: (params: LoadEventByDateAndStartRepository.Params) => Promise<LoadEventByDateAndStartRepository.Result>
}

export namespace LoadEventByDateAndStartRepository {
  export type Params = {
    start: Date
  }

  export type Result = {
    schedulerId: string
    start: Date
    end: Date
  } | null
}
