export interface LoadCurrentWeekTasks {
  load: (params: LoadCurrentWeekTasks.Params) => Promise<LoadCurrentWeekTasks.Result>
}

export namespace LoadCurrentWeekTasks {
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
