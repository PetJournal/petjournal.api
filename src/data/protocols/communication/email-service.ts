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
    from: {
      email: string
      name: string
    }
    to: {
      email: string
      name: string
    }
    subject: string
    text: string
  }

  export type Result = boolean
}
