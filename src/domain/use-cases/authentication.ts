import { type HashGenerator, type HashComparer, type LoadGuardianByEmailRepository, type TokenGenerator, type UpdateAccessTokenRepository } from '@/data/protocols'

export interface Authentication {
  auth: (credentials: Authentication.Params) => Promise<Authentication.Result>
}

export namespace Authentication {
  export interface Params {
    email: string
    password: string
  }

  export type Result = string | null

  export interface Dependencies {
    loadGuardianByEmailRepository: LoadGuardianByEmailRepository
    hashGenerator: HashGenerator
    hashComparer: HashComparer
    tokenGenerator: TokenGenerator
    updateAccessTokenRepository: UpdateAccessTokenRepository
  }
}
