export interface GetGuardianName {
  load: (userId: GetGuardianName.Params) => Promise<GetGuardianName.Result>
}

export namespace GetGuardianName {
  export type Params = string
  export interface Result {
    firstName: string
    lastName: string
  }
}
