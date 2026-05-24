export interface LoadCurrentWeekTasks {
  load: (params: LoadCurrentWeekTasks.Params) => Promise<LoadCurrentWeekTasks.Result>
}

export namespace LoadCurrentWeekTasks {
  export type Params = {
    date: Date
    guardianId: string
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
