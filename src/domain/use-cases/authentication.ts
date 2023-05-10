import { type HashComparer, type LoadGuardianByEmailRepository, type TokenGenerator, type UpdateAccessTokenRepository } from '@/data/protocols'

export interface Authentication {
  auth: (credentials: Authentication.Params) => Promise<Authentication.Result | null>
}

export namespace Authentication {
  export interface Params {
    email: string
    password: string
  }

  export type Result = string

  export interface Dependencies {
    loadGuardianByEmailRepository: LoadGuardianByEmailRepository
    hashComparer: HashComparer
    tokenGenerator: TokenGenerator
    updateAccessTokenRepository: UpdateAccessTokenRepository
  }
}
