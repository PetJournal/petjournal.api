export interface LoadGuardianByEmailRepository {
  loadByEmail: (email: LoadGuardianByEmailRepository.Params) => Promise<LoadGuardianByEmailRepository.Result>
}

export namespace LoadGuardianByEmailRepository {
  export type Params = string
  export type Result = {
    [key: string]: any
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    accessToken: string | null
    forgetPasswordToken: string | null
  } | undefined
}
