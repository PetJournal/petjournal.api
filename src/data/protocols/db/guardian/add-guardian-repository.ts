export interface AddGuardianRepository {
  add: (guardian: AddGuardianRepository.Params) => Promise<AddGuardianRepository.Result>
}

export namespace AddGuardianRepository {
  export type Params = {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    verificationToken: string
  }

  export type Result = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  } | null
}
