import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'

export interface AddGuardian {
  add: (guardianData: AddGuardian.Params) => Promise<AddGuardian.Result>
}

export namespace AddGuardian {
  export interface Params {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    verificationToken: string
  }

  export type Result = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  } | undefined

  export interface Dependencies {
    addGuardianRepository: AddGuardianRepository
    hashGenerator: HashGenerator
  }
}
