import { type AddGuardian } from '@/domain/use-cases'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AddGuardian.Params>
}
