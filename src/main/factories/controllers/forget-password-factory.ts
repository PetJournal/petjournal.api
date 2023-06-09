import env from '@/main/config/env'
import { type Controller } from '@/application/protocols'
import { ForgetPasswordController } from '@/application/controllers'
import { DbForgetPassword, ForgetPasswordTokenGenerator } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/cryptography'
import { NodeMailerAdapter } from '@/infra/communication'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
import { makeForgetPasswordValidation } from '@/main/factories'

export const makeForgetPasswordController = (): Controller => {
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
  const forgetPassword = new DbForgetPassword({ loadGuardianByEmailRepository, tokenGenerator, emailService: nodeMailerAdapter })
  const loggerPgRepository = new LoggerPgRepository()
  const validation = makeForgetPasswordValidation()
  const dependencies: ForgetPasswordController.Dependencies = {
    validation,
    forgetPassword
  }
  const forgetPasswordController = new ForgetPasswordController(dependencies)
  return new LoggerControllerDecorator(forgetPasswordController, loggerPgRepository)
}
