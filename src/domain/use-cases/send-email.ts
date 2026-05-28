import { type EmailService } from '@/data/protocols'

export interface SendEmail {
  send: (data: SendEmail.Params) => Promise<SendEmail.Result>
}

export namespace SendEmail {
  export type Params = {
    id: string
    firstName: string
    lastName: string
    email: string
  }

  export type Result = void

  export type Dependencies = {
    emailService: EmailService
  }
}
