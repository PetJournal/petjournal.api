export interface LoadGuardianByEmail {
  load: (email: LoadGuardianByEmail.Params) => Promise<LoadGuardianByEmail.Result>
}

export namespace LoadGuardianByEmail {
  export type Params = string
  export interface Guardian {
    firstName: string
    lastName: string
  }

  export type Result = Guardian | undefined
}
