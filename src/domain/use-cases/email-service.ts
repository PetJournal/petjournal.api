export interface EmailService {
  send: (options: EmailService.Options) => Promise<EmailService.Result>
}

export namespace EmailService {
  export interface Transport {
    host: string
    port: number
    secure: boolean
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
