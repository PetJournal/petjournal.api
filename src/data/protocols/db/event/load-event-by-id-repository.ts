export interface LoadEventByIdRepository {
  loadById: (params: LoadEventByIdRepository.Params) => Promise<LoadEventByIdRepository.Result>
}

export namespace LoadEventByIdRepository {
  export type Params = {
    eventId: string
    guardianId: string
  }

  export type Result = {
    id: string
    schedulerId: string
    start: Date
    end: Date
  } | null

}
