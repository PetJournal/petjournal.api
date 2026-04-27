import { DbLoadGuardian } from '@/data/use-cases'
import { type LoadGuardian } from '@/domain/use-cases'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbLoadGuardian = (): LoadGuardian => {
  const guardianRepository = new GuardianAccountRepository()
  return new DbLoadGuardian({ guardianRepository })
}
