export interface DeleteEventsBySchedulerIdRepository {
  delete: (params: DeleteEventsBySchedulerIdRepository.Params) => Promise<DeleteEventsBySchedulerIdRepository.Result>
}

export namespace DeleteEventsBySchedulerIdRepository {
  export type Params = {
    guardianId: string
    schedulerId: string
  }

  export type Result = boolean
}
