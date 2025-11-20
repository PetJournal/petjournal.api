export interface LoadPreviousTasksByPetIdRepository {
  loadPreviousByPetId: (
    params: LoadPreviousTasksByPetIdRepository.Params
  ) => Promise<LoadPreviousTasksByPetIdRepository.Result>
}

export namespace LoadPreviousTasksByPetIdRepository {
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
    totalPages: number
    history: Event[]
  }
}
