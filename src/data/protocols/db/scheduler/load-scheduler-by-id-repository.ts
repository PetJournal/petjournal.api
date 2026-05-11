export interface LoadSchedulerByIdRepository {
  load: (params: LoadSchedulerByIdRepository.Params) => Promise<LoadSchedulerByIdRepository.Result>
}

export namespace LoadSchedulerByIdRepository {
  export type Params = {
    schedulerId: string
    guardianId: string
  }

  export type Result = {
    id: string
    tagId: string
    guardianId: string
    title: string
    description: string
    note: string
    startAt: Date
    endAt: Date
    daysOfWeek: number[]
    daysOfMonth: number[]
    daily: boolean
    pets: Array<{
      id: string
      petName: string
      image: string
    }>
  } | null
}
