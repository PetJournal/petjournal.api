export interface LoadCurrentDateTasks {
  load: (params: LoadCurrentDateTasks.Params) => Promise<LoadCurrentDateTasks.Result>
}

export namespace LoadCurrentDateTasks {
  export type Params = {
    date: Date
    guardianId: string
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
