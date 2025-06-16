export interface LoadCurrentDateTasks {
  load: (params: LoadCurrentDateTasks.Params) => Promise<LoadCurrentDateTasks.Result>
}

export namespace LoadCurrentDateTasks {
  export type Params = {
    date: Date
  }

  export type Result = Array<{
    id: string
    schedulerId: string
    start: Date
    end: Date
  }>
}
