import env from '@/main/config/env'
import { type Middleware } from '@/application/protocols'
import { AuthMiddleware } from '@/application/middlewares'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'

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
  return new AuthMiddleware(dependencies)
}
