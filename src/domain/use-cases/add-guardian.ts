import {
  type LoadGuardianByEmailRepository,
  type AddGuardianRepository,
  type HashGenerator,
  type LoadGuardianByPhoneRepository
} from '@/data/protocols'

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
    guardianRepository: AddGuardianRepository & LoadGuardianByEmailRepository & LoadGuardianByPhoneRepository
    hashService: HashGenerator
  }
}
