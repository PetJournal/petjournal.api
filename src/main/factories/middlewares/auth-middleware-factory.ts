import { AuthMiddleware } from '@/application/middlewares/auth'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { type Middleware } from '@/application/middlewares/middleware'
import env from '@/main/config/env'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'

export const makeAuthMiddleware = (): Middleware => {
  const secret = env.secret
  const salt = Number(env.salt)
  const tokenDecoder = new JwtAdapter(secret)
  const hashComparer = new BcryptAdapter(salt)
  const loadGuardianById = new GuardianAccountRepository()
  return new AuthMiddleware({ tokenDecoder, loadGuardianById, hashComparer })
}
