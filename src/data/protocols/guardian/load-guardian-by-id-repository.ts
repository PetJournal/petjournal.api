export interface LoadGuardianByIdRepository {
  loadById: (email: LoadGuardianByIdRepository.Params) => Promise<LoadGuardianByIdRepository.Result | null>
}

export namespace LoadGuardianByIdRepository {
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
