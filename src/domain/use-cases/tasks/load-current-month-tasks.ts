export interface LoadCurrentMonthTasks {
  load: (params: LoadCurrentMonthTasks.Params) => Promise<LoadCurrentMonthTasks.Result>
}

export namespace LoadCurrentMonthTasks {
  export type Params = {
    date: Date
    tagId?: string
    page?: number
    limit?: number
  }

  export type Result = Array<{
    id: string
    schedulerId: string
    start: Date
    end: Date
  }>
}
