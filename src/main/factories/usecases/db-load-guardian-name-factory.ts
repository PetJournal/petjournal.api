import { DbLoadGuardianName } from '@/data/use-cases'
import { type LoadGuardianName } from '@/domain/use-cases'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbLoadGuardianName = (): LoadGuardianName => {
  const guardianRepository = new GuardianAccountRepository()
  return new DbLoadGuardianName({ guardianRepository })
}
