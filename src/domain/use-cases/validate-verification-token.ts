import { type LoadGuardianByEmailRepository, type HashComparer } from '@/data/protocols'

export interface ValidateVerificationToken {
  validate: (guardianData: ValidateVerificationToken.Params) => Promise<ValidateVerificationToken.Result>
}

export namespace ValidateVerificationToken {

  export type Params = {
    email: string
    verificationToken: string
  }

  export type Result = Error | boolean

  export type Dependencies = {
    guardianRepository: LoadGuardianByEmailRepository
    hashService: HashComparer
  }
}
