export interface DeleteEventByIdRepository {
  deleteById: (params: DeleteEventByIdRepository.Params) => Promise<DeleteEventByIdRepository.Result>
}

export namespace DeleteEventByIdRepository {
  export type Params = {
    eventId: string
    guardianId: string
  }

  export type Result = boolean | undefined
}
