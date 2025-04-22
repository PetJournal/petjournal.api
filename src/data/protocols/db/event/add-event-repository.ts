export interface AddEventRepository {
  add: (params: AddEventRepository.Params) => Promise<AddEventRepository.Result>
}

export namespace AddEventRepository {
  export type Params = {
    schedulerId: string
    start: Date
    end: Date
    date: Date
  }

  export type Result = {
    id: string
    schedulerId: string
    start: Date
    end: Date
    date: Date
  } | undefined
}
