export interface LoadCurrentDateTasks {
  load: (params: LoadCurrentDateTasks.Params) => Promise<LoadCurrentDateTasks.Result>
}

export namespace LoadCurrentDateTasks {
  export type Params = {
    date: Date
    tagId?: string
    page?: number
    limit?: number
  }

  type Task = {
    id: string
    schedulerId: string
    start: Date
    end: Date
  }

  export type Result = Task[]
}
