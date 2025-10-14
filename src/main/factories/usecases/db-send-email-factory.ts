import { DbSendEmail } from '@/data/use-cases'
import { type SendEmail } from '@/domain/use-cases'
import { MailerooAdapter } from '@/infra/communication'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbSendEmail = (): SendEmail => {
  const emailService = new MailerooAdapter()
  const guardianRepository = new GuardianAccountRepository()
  return new DbSendEmail({ emailService, guardianRepository })
}
