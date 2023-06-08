import { type Controller } from '@/application/protocols'
import { ForgetPasswordController } from '@/application/controllers'
import { EmailValidatorAdapter } from '@/infra/validators'
import { DbForgetPassword, ForgetPasswordTokenGenerator } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { NodeMailerAdapter } from '@/infra/communication'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
import env from '@/main/config/env'

export const makeForgetPasswordController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const salt = Number(env.salt)
  const bcryptAdapter = new BcryptAdapter(salt)
  const saveTokenRepository = new GuardianAccountRepository()
  const tokenGenerator = new ForgetPasswordTokenGenerator(bcryptAdapter, saveTokenRepository)
  const transporter = {
    service: 'gmail',
    auth: {
      user: env.mailUser,
      pass: env.mailPass
    }
  }
  const nodeMailerAdapter = new NodeMailerAdapter(transporter)
  const dbForgetPassword = new DbForgetPassword({ loadGuardianByEmailRepository, tokenGenerator, emailService: nodeMailerAdapter })
  const dependencies: ForgetPasswordController.Dependencies = {
    emailValidator,
    forgetPassword: dbForgetPassword
  }
  const loggerPgRepository = new LoggerPgRepository()
  const forgetPasswordController = new ForgetPasswordController(dependencies)
  return new LoggerControllerDecorator(forgetPasswordController, loggerPgRepository)
}
