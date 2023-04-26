import { type LoadGuardianByEmail } from '@/domain/use-cases'

export interface LoadGuardianByEmailRepository {
  loadByEmail: (email: string) => Promise<LoadGuardianByEmailRepository.Result>
}

export namespace LoadGuardianByEmailRepository {
  export type Result = LoadGuardianByEmail.Result
}
