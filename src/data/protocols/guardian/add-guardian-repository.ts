export interface AddGuardianRepository {
  add: (guardian: AddGuardianRepository.Params) => Promise<AddGuardianRepository.Result>
}

export namespace AddGuardianRepository {
  export interface Params {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  }

  export type Result = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  } | undefined
}
