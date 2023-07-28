export interface LoadGuardianName {
  load: (userId: LoadGuardianName.Params) => Promise<LoadGuardianName.Result>
}

export namespace LoadGuardianName {
  export type Params = string
  export type Result = {
    firstName: string
    lastName: string
  } | null
}
