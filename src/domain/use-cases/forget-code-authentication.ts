import {
  type TokenGenerator,
  type HashComparer,
  type LoadGuardianByEmailRepository,
  type HashGenerator
} from '@/data/protocols'

export interface ForgetCodeAuthentication {
  auth: (input: ForgetCodeAuthentication.Params) => Promise<ForgetCodeAuthentication.Result>
}

export namespace ForgetCodeAuthentication {
  export interface Params {
    email: string
    forgetPasswordCode: string
  }

  export type Result = Error | void

  export interface Dependencies {
    loadGuardianByEmailRepository: LoadGuardianByEmailRepository
    hashComparer: HashComparer
    tokenGenerator: TokenGenerator
    hashGenerator: HashGenerator
  }
}
