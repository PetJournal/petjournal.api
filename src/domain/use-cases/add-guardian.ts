import { type Guardian } from 'domain/entities/guardian'

export interface IAddGuardian {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  isProvicyPolicyAccepted: boolean
}

export interface AddGuardian {
  add: (guardian: IAddGuardian) => Guardian
}
