import { type SendEmail } from '@/domain/use-cases'
import { type EmailService } from '../protocols'
import env from '@/main/config/env'

export class DbSendEmail implements SendEmail {
  private readonly emailService: EmailService

  constructor ({ emailService }: SendEmail.Dependencies) {
    this.emailService = emailService
  }

  async send ({ id, firstName, lastName, email }: SendEmail.Params): Promise<SendEmail.Result> {
    await this.emailService.send({
      from: {
        email: env.emailPetJournal,
        name: 'Pet Journal'
      },
      to: {
        email,
        name: lastName
      },
      subject: 'Ative sua conta',
      text: `
          Olá ${firstName} ${lastName},\\n
          Acesse o link para ativar sua conta: ${env.host}/api/guardian/email-confirmation/${id}
        `
    })
  }
}
