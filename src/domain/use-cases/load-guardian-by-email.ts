export interface LoadGuardianByEmail {
  load: (email: string) => Promise<LoadGuardianByEmail.Result>
}

export namespace LoadGuardianByEmail {

  export interface Guadian {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    isPrivacyPolicyAccepted: boolean
  }
  export type Result = Guadian | undefined
}
