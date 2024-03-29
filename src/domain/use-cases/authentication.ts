import {
  type HashGenerator,
  type HashComparer,
  type LoadGuardianByEmailRepository,
  type TokenGenerator,
  type UpdateAccessTokenRepository
} from '@/data/protocols'

export interface Authentication {
  auth: (credentials: Authentication.Params) => Promise<Authentication.Result>
}

export namespace Authentication {

  export interface Params {
    email: string
    sensitiveData: { field: string, value: string }
  }

  export type Result = Error | string
  export interface Dependencies {
    guardianRepository: LoadGuardianByEmailRepository & UpdateAccessTokenRepository
    hashService: HashGenerator & HashComparer
    tokenService: TokenGenerator
  }
}
