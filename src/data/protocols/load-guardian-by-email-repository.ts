import { type LoadGuardianByEmail } from '@/domain/use-cases'

export interface LoadGuardianByEmailRepository {
  loadByEmail: (email: LoadGuardianByEmailRepository.Params) => Promise<LoadGuardianByEmailRepository.Result>
}

export namespace LoadGuardianByEmailRepository {
  export type Params = string
  export type Result = LoadGuardianByEmail.Result
}
