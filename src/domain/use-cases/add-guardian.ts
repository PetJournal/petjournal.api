import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'

export interface AddGuardian {
  add: (guardianData: AddGuardian.Params) => Promise<AddGuardian.Result>
}

export namespace AddGuardian {
  export type Params = {
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
  } | null

  export type Dependencies = {
    guardianRepository: AddGuardianRepository
    hashService: HashGenerator
  }
}
