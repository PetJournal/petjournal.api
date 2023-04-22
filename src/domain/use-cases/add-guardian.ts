export interface AddGuardian {
  add: (guardianData: AddGuardian.Params) => Promise<AddGuardian.Result>
}

export namespace AddGuardian {
  export interface Params {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  }

  export type Result = boolean
}
