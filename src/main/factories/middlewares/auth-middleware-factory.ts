import env from '@/main/config/env'
import { type Middleware } from '@/application/protocols'
import { AuthMiddleware } from '@/application/middlewares'
import { GuardianAccountRepository, LoggerPgRepository } from '@/infra/repos/postgresql'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeAuthMiddleware = (): Middleware => {
  const secret = env.secret
  const salt = Number(env.salt)
  const tokenDecoder = new JwtAdapter(secret)
  const hashComparer = new BcryptAdapter(salt)
  const loadGuardianById = new GuardianAccountRepository()
  const dependencies: AuthMiddleware.Dependencies = {
    tokenDecoder,
    loadGuardianById,
    hashComparer
  }
  const authMiddleware = new AuthMiddleware(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(authMiddleware, loggerPgRepository)
}
