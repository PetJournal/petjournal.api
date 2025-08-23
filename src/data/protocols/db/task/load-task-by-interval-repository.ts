export interface LoadTasksByIntervalRepository {
  loadAllByInterval: (params: LoadTasksByIntervalRepository.Params) => Promise<LoadTasksByIntervalRepository.Result>
}

export namespace LoadTasksByIntervalRepository {
  export type Params = {
    start: Date
    end: Date
    tagId?: string
    offset?: number
    limit?: number
  }

  export type Result = Array<{
    id: string
    start: Date
    end: Date
    schedulerId: string
    scheduler: {
      id: string
      title: string
      description: string
      note: string
      startAt: Date
      endAt: Date
      daysOfWeek: number[]
      daysOfMonth: number[]
      daily: boolean
      tag: {
        name: string
        color: string
      }
      pets: Array<{
        id: string
        image: string
      }>
    }
  }>
}
