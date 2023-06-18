import env from '@/main/config/env'
import { type Authentication } from '@/domain/use-cases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { DbAuthentication } from '@/data/use-cases'

export const makeDbAuthentication = (): Authentication => {
  const salt = Number(env.salt)
  const secret = env.secret
  const hashGenerator = new BcryptAdapter(salt)
  const hashComparer = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(secret)
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const updateAccessTokenRepository = new GuardianAccountRepository()
  const authentication = new DbAuthentication({
    loadGuardianByEmailRepository,
    hashGenerator,
    hashComparer,
    tokenGenerator,
    updateAccessTokenRepository
  })
  return authentication
}
