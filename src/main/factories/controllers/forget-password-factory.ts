import { ForgetPasswordController } from '@/application/controllers/forget-password'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbLoadGuardianByEmail, DbSaveToken } from '@/data/use-cases'
import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { NodeMailerAdapter } from '@/infra/node-mailer-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import env from '@/main/config/env'

export const makeForgetPasswordController = (): ForgetPasswordController => {
  const emailValidator = new EmailValidatorAdapter()
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const dbLoadAccountByEmail = new DbLoadGuardianByEmail(loadGuardianByEmailRepository)
  const jwtAdapter = new JwtAdapter(env.secret)
  const saveTokenRepository = new GuardianAccountRepository()
  const dbSaveToken = new DbSaveToken(saveTokenRepository)
  const tokenGenerator = new ForgetPasswordTokenGenerator(jwtAdapter, dbSaveToken)
  const transporter = {
    service: 'gmail',
    auth: {
      user: env.mailUser,
      pass: env.mailPass
    }
  }
  const nodeMailerAdapter = new NodeMailerAdapter(transporter)
  return new ForgetPasswordController(emailValidator, dbLoadAccountByEmail, tokenGenerator, nodeMailerAdapter)
}
