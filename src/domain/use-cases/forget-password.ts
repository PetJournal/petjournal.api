import {
  type LoadGuardianByEmailRepository,
  type UpdateVerificationTokenRepository,
  type TokenGenerator,
  type EmailService,
  type HashGenerator
} from '@/data/protocols'

export interface ForgetPassword {
  forgetPassword: (params: ForgetPassword.Params) => Promise<ForgetPassword.Result>
}

export namespace ForgetPassword {
  export interface Params {
    email: string
  }

  export type Result = boolean

  export interface Dependencies {
    guardianRepository: LoadGuardianByEmailRepository & UpdateVerificationTokenRepository
    emailService: EmailService
    tokenService: TokenGenerator
    hashService: HashGenerator
  }
}
