export interface LoadGuardian {
  load: (userId: LoadGuardian.Params) => Promise<LoadGuardian.Result>
}

export namespace LoadGuardian {
  export type Params = string
  export type Result = {
    firstName: string
    lastName: string
    email: string
    phone: string
    image: string
  } | null
}
