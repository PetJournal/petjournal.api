import { type Guardian } from 'domain/entities/guardian'

export interface IAddGuardian {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  isPrivacyPolicyAccepted: boolean
}

export interface AddGuardian {
  add: (guardian: IAddGuardian) => Promise<Guardian>
}
