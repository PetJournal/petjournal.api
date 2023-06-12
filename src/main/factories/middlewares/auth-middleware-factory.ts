import { type Middleware } from '@/application/protocols'
import { AuthMiddleware } from '@/application/middlewares'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { BcryptAdapter } from '@/infra/cryptography'
import env from '@/main/config/env'

export const makeAuthMiddleware = (): Middleware => {
  const secret = env.secret
  const salt = Number(env.salt)
  const tokenService = new JwtAdapter(secret)
  const hashService = new BcryptAdapter(salt)
  const guardianRepository = new GuardianAccountRepository()
  return new AuthMiddleware({ tokenService, guardianRepository, hashService })
}
