import {
  type LoadGuardianByEmailRepository,
  type HashGenerator,
  type TokenGenerator,
  type UpdateAccessTokenRepository
} from '@/data/protocols'

export interface CreateAccessToken {
  create: (email: CreateAccessToken.Params) => Promise<CreateAccessToken.Result>
}

export namespace CreateAccessToken {
  export type Params = string
  export type Result = Error | string
  export interface Dependencies {
    guardianRepository: LoadGuardianByEmailRepository & UpdateAccessTokenRepository
    hashService: HashGenerator
    tokenService: TokenGenerator
  }
}
