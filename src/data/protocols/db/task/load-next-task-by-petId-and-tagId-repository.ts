export interface LoadNextTasksByPetIdAndTagIdRepository {
  loadByPetIdAndTagId: (params: LoadNextTasksByPetIdAndTagIdRepository.Params) => Promise<LoadNextTasksByPetIdAndTagIdRepository.Result>
}

export namespace LoadNextTasksByPetIdAndTagIdRepository {
  export type Params = {
    guardianId: string
    petId: string
    tagId: string
    page?: number
    limit?: number
  }

  export type Result = {
    page: number
    limit: number
    totalPages: number
    events: Array<{
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
}
