export interface EmailService {
  send: (options: EmailService.Options) => Promise<EmailService.Result>
}

export namespace EmailService {
  export interface Transport {
    service: string
    auth: {
      user: string
      pass: string
    }
  }

  export interface Options {
    from: string
    to: string
    subject: string
    text: string
  }

  export type Result = boolean
}
