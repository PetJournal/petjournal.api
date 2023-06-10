import env from '@/main/config/env'
import { type ForgetPassword } from '@/domain/use-cases'
import { DbForgetPassword, ForgetPasswordTokenGenerator } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { NodeMailerAdapter } from '@/infra/communication'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbForgetPassword = (): ForgetPassword => {
  const salt = Number(env.salt)
  const bcryptAdapter = new BcryptAdapter(salt)
  const saveTokenRepository = new GuardianAccountRepository()
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const tokenGenerator = new ForgetPasswordTokenGenerator(bcryptAdapter, saveTokenRepository)
  const transporter = {
    service: 'gmail',
    auth: {
      user: env.mailUser,
      pass: env.mailPass
    }
  }
  const nodeMailerAdapter = new NodeMailerAdapter(transporter)
  const forgetPassword = new DbForgetPassword({
    loadGuardianByEmailRepository,
    tokenGenerator,
    emailService: nodeMailerAdapter
  })
  return forgetPassword
}
