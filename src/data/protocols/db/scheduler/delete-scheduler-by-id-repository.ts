export interface DeleteSchedulerByIdRepository {
  delete: (param: DeleteSchedulerByIdRepository.Param) => Promise<DeleteSchedulerByIdRepository.Result>
}

export namespace DeleteSchedulerByIdRepository {
  export type Param = string

  export type Result = boolean
}
