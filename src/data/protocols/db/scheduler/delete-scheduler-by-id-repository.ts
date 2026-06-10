export interface DeleteSchedulerByIdRepository {
  delete: (params: DeleteSchedulerByIdRepository.Params) => Promise<DeleteSchedulerByIdRepository.Result>
}

export namespace DeleteSchedulerByIdRepository {
  export type Params = {
    schedulerId: string
    guardianId: string
  }

  export type Result = boolean
}
