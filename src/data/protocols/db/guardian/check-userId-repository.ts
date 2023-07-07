export interface CheckUserId {
  checkUserId: (userId: CheckUserId.Params) => Promise<CheckUserId.Result>
}

export namespace CheckUserId {
  export type Params = string

  export type Result = boolean
}
