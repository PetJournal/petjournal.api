import {
  type LoadGuardianByEmailRepository,
  type TokenGenerator,
  type EmailService
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
    loadGuardianByEmailRepository: LoadGuardianByEmailRepository
    tokenGenerator: TokenGenerator
    emailService: EmailService
  }
}
