export interface LoadGuardianByEmailRepository {
  loadByEmail: (email: LoadGuardianByEmailRepository.Params) => Promise<LoadGuardianByEmailRepository.Result | null>
}

export namespace LoadGuardianByEmailRepository {
  export type Params = string
  export interface Result {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    accessToken: string | null
    isPrivacyPolicyAccepted: boolean
  }
}
