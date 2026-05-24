import { DbUpdateSettings } from '@/data/use-cases'
import { type UpdateSettings } from '@/domain/use-cases'
import { GuardianAccountRepository, SettingsRepository } from '@/infra/repos/postgresql'

export const makeDbUpdateSettings = (): DbUpdateSettings => {
  const guardianRepository = new GuardianAccountRepository()
  const settingsRepository = new SettingsRepository()
  const dependencies: UpdateSettings.Dependencies = {
    guardianRepository,
    settingsRepository
  }
  const dbUpdateSettings = new DbUpdateSettings(dependencies)
  return dbUpdateSettings
}
