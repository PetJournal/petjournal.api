import { type EmailService } from '@/data/protocols'
import env from '@/main/config/env'

export class MailerooAdapter implements EmailService {
  private readonly apiKey = env.mailerooApiKey
  private readonly apiUrl = env.mailerooApiSenderUrl

  async send (message: EmailService.Options): Promise<EmailService.Result> {
    const body = {
      ...message,
      from: {
        display_name: message.from.name,
        address: message.from.email
      },
      to: {
        display_name: message.to.name,
        address: message.to.email
      },
      html: `<h1>${message.text}</h1>`
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    })
    if (!response.ok) {
      const errorbody = await response.text()
      throw new Error(`Email service error ${response.status}: ${errorbody}`)
    }
    return true
  }
}
