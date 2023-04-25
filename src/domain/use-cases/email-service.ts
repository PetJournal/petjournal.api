export interface EmailOptions {
  from: string
  to: string
  subject: string
  text: string
}

export interface EmailService {
  send: (options: EmailOptions) => Promise<boolean>
}
