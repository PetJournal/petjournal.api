import env from '@/main/config/env'
import { type ForgetPassword } from '@/domain/use-cases'
import { DbForgetPassword, ForgetPasswordTokenGenerator } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { NodeMailerAdapter } from '@/infra/communication'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbForgetPassword = (): ForgetPassword => {
  const salt = Number(env.salt)
  const bcryptAdapter = new BcryptAdapter(salt)
  const guardianRepository = new GuardianAccountRepository()
  const tokenService = new ForgetPasswordTokenGenerator(bcryptAdapter, guardianRepository)
  const transporter = {
    service: 'gmail',
    auth: {
      user: env.mailUser,
      pass: env.mailPass
    }
  }
  const nodeMailerAdapter = new NodeMailerAdapter(transporter)
  const forgetPassword = new DbForgetPassword({
    guardianRepository,
    tokenService,
    emailService: nodeMailerAdapter
  })
  return forgetPassword
}
