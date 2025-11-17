export interface LoadTasksByPetIdRepository {
  loadByPetId: (
    params: LoadTasksByPetIdRepository.Params
  ) => Promise<LoadTasksByPetIdRepository.Result>
}

export namespace LoadTasksByPetIdRepository {
  export type Params = {
    petId: string
    page?: number
    limit?: number
  }

  export type Event = {
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
  }

  export type Result = {
    page: number
    limit: number
    totalHistory: number
    totalPages: number
    history: Event[]
    nextEvents: Event[]
  }
}
