import env from '@/main/config/env'
import { type ForgetPassword } from '@/domain/use-cases'
import { DbForgetPassword } from '@/data/use-cases'
import { BcryptAdapter, VerificationTokenGenerator } from '@/infra/cryptography'
import { MailerooAdapter } from '@/infra/communication'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbForgetPassword = (): ForgetPassword => {
  const salt = Number(env.salt)
  const hashService = new BcryptAdapter(salt)
  const guardianRepository = new GuardianAccountRepository()
  const tokenService = new VerificationTokenGenerator()
  const emailService = new MailerooAdapter()
  const forgetPassword = new DbForgetPassword({
    guardianRepository,
    hashService,
    tokenService,
    emailService
  })
  return forgetPassword
}
