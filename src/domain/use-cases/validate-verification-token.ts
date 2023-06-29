import { type LoadGuardianByEmailRepository, type HashComparer } from '@/data/protocols'

export interface ValidateVerificationToken {
  validate: (input: ValidateVerificationToken.Params) => Promise<ValidateVerificationToken.Result>
}

export namespace ValidateVerificationToken {
  export interface Params {
    email: string
    verificationToken: string
  }

  export type Result = Error | boolean
  export interface Dependencies {
    guardianRepository: LoadGuardianByEmailRepository
    hashService: HashComparer
  }
}
