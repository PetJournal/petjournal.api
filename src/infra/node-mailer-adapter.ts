import { type EmailService } from '@/domain/use-cases'
import { createTransport, type Transporter } from 'nodemailer'

export class NodeMailerAdapter implements EmailService {
  private readonly transporter: Transporter

  constructor (transporter: EmailService.Transport) {
    this.transporter = createTransport(transporter)
  }

  async send (options: EmailService.Options): Promise<EmailService.Result> {
    let success: boolean = false

    const info = await this.transporter.sendMail(options)

    if (info) {
      success = true
    }

    return success
  }
}
