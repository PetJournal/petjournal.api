import { AuthMiddleware } from '@/application/middlewares/auth'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { type Middleware } from '@/application/middlewares/middleware'
import env from '@/main/config/env'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'

export const makeAuthMiddleware = (): Middleware => {
  const secret = env.secret
  const salt = Number(env.salt)
  const tokenService = new JwtAdapter(secret)
  const hashService = new BcryptAdapter(salt)
  const guardianRepository = new GuardianAccountRepository()
  return new AuthMiddleware({ tokenService, guardianRepository, hashService })
}
