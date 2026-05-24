import { DbEmailConfirmation } from '@/data/use-cases'
import { type EmailConfirmation } from '@/domain/use-cases'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'

export const makeDbEmailConfirmation = (): EmailConfirmation => {
  const guardianRepository = new GuardianAccountRepository()
  const dependencies: EmailConfirmation.Dependencies = {
    guardianRepository
  }
  const emailConfirmation = new DbEmailConfirmation(dependencies)
  return emailConfirmation
}
