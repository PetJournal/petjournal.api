import env from '@/main/config/env'
import { type CreateAccessToken } from '@/domain/use-cases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { DbCreateAccessToken } from '@/data/use-cases'

export const makeDbCreateAccessToken = (): CreateAccessToken => {
  const salt = Number(env.salt)
  const secret = env.secret
  const guardianRepository = new GuardianAccountRepository()
  const hashService = new BcryptAdapter(salt)
  const tokenService = new JwtAdapter(secret)
  const createAccessToken = new DbCreateAccessToken({
    guardianRepository,
    hashService,
    tokenService
  })
  return createAccessToken
}
