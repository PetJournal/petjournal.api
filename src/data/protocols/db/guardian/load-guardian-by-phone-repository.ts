export interface LoadGuardianByPhoneRepository {
  loadByPhone: (phone: LoadGuardianByPhoneRepository.Params) => Promise<LoadGuardianByPhoneRepository.Result>
}

export namespace LoadGuardianByPhoneRepository {
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
    verificationToken: string
    verificationTokenCreatedAt: Date
  } | undefined
}
