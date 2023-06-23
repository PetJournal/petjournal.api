import env from '@/main/config/env'
import { type Authentication } from '@/domain/use-cases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { DbAuthentication } from '@/data/use-cases'

export const makeDbAuthentication = (): Authentication => {
  const salt = Number(env.salt)
  const secret = env.secret
  const hashService = new BcryptAdapter(salt)
  const tokenService = new JwtAdapter(secret)
  const guardianRepository = new GuardianAccountRepository()
  const authentication = new DbAuthentication({
    hashService,
    tokenService,
    guardianRepository
  })
  return authentication
}
