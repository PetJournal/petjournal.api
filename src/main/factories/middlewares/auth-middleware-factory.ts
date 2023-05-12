import { AuthMiddleware } from '@/application/middlewares/auth'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { type Middleware } from '@/application/middlewares/middleware'
import env from '@/main/config/env'

export const makeAuthMiddleware = (): Middleware => {
  const secret = env.secret
  const tokenDecoder = new JwtAdapter(secret)
  const loadGuardianById = new GuardianAccountRepository()
  return new AuthMiddleware({ tokenDecoder, loadGuardianById })
}
