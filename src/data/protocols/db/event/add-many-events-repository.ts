export interface AddManyEventsRepository {
  addMany: (params: AddManyEventsRepository.Params) => Promise<AddManyEventsRepository.Result>
}

export namespace AddManyEventsRepository {
  export type Params = Array<{
    schedulerId: string
    start: Date
    end: Date
  }>

  export type Result = boolean

}
