export interface LoadGuardianByEmail {
  load: (email: string) => Promise<LoadGuardianByEmail.Result>
}

export namespace LoadGuardianByEmail {
  export interface Result {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    passwordConfirmation: string
    isPrivacyPolicyAccepted: boolean
  }
}
