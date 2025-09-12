export interface LoadCurrentWeekTasks {
  load: (params: LoadCurrentWeekTasks.Params) => Promise<LoadCurrentWeekTasks.Result>
}

export namespace LoadCurrentWeekTasks {
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
