export interface LoadGuardianByIdRepository {
  loadById: (id: LoadGuardianByIdRepository.Params) => Promise<LoadGuardianByIdRepository.Result>
}

export namespace LoadGuardianByIdRepository {
  export type Params = string
  export type Result = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    accessToken: string | null
    verificationToken: string
  } | undefined
}
