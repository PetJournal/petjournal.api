import { DbSendEmail } from '@/data/use-cases'
import { type SendEmail } from '@/domain/use-cases'
import { MailerooAdapter } from '@/infra/communication'

export const makeDbSendEmail = (): SendEmail => {
  const emailService = new MailerooAdapter()
  return new DbSendEmail({ emailService })
}
