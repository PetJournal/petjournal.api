import { type LoadGuardianByEmailRepository } from '@/data/protocols'

export interface ForgetCodeAuthentication {
  auth: (input: ForgetCodeAuthentication.Params) => Promise<ForgetCodeAuthentication.Result>
}

export namespace ForgetCodeAuthentication {
  export interface Params {
    email: string
    forgetPasswordCode: string
  }

  export type Result = boolean | null

  export interface Dependencies {
    loadGuardianByEmailRepository: LoadGuardianByEmailRepository
  }
}
