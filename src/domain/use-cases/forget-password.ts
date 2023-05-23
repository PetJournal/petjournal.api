import { type LoadGuardianByEmailRepository, type TokenGenerator } from '@/data/protocols'
import { type EmailService } from './email-service'

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
