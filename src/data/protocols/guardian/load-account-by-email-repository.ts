import { type AddGuardian } from '@/domain/use-cases'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AddGuardian.Params | null>
}
