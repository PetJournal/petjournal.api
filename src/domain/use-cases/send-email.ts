import { type EmailService, type LoadGuardianByEmailRepository } from '@/data/protocols'

export interface SendEmail {
  send: (data: SendEmail.Params) => Promise<SendEmail.Result>
}

export namespace SendEmail {
  export type Params = {
    email: string
  }

  export type Result = void

  export type Dependencies = {
    guardianRepository: LoadGuardianByEmailRepository
    emailService: EmailService
  }
}
