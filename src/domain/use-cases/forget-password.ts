import {
  type LoadGuardianByEmailRepository,
  type UpdateVerificationTokenRepository,
  type TokenGenerator,
  type EmailService,
  type HashGenerator
} from '@/data/protocols'

export interface ForgetPassword {
  forgetPassword: (guardianData: ForgetPassword.Params) => Promise<ForgetPassword.Result>
}

export namespace ForgetPassword {
  export interface Params {
    email: string
  }

  export type Result = boolean

  export type Dependencies = {
    guardianRepository: LoadGuardianByEmailRepository & UpdateVerificationTokenRepository
    emailService: EmailService
    tokenService: TokenGenerator
    hashService: HashGenerator
  }
}
