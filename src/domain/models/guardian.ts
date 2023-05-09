export interface Guardian {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  accessToken: string | null
  isPrivacyPolicyAccepted: boolean
}
