import { DbGetGuardianName } from '@/data/use-cases'
import { type GetGuardianName } from '@/domain/use-cases'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbGetGuardianName = (): GetGuardianName => {
  const guardianRepository = new GuardianAccountRepository()
  return new DbGetGuardianName({ guardianRepository })
}
