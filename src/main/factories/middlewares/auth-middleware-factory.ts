import env from '@/main/config/env'
import { type Middleware } from '@/application/protocols'
import { AuthMiddleware } from '@/application/middlewares'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeAuthMiddleware = (): Middleware => {
  const secret = env.secret
  const salt = Number(env.salt)
  const tokenService = new JwtAdapter(secret)
  const hashService = new BcryptAdapter(salt)
  const guardianRepository = new GuardianAccountRepository()
  const dependencies: AuthMiddleware.Dependencies = {
    tokenService,
    hashService,
    guardianRepository
  }
  const authMiddleware = new AuthMiddleware(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(authMiddleware, loggerPgRepository)
}
