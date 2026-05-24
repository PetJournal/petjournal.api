import { DbLoadSettings } from '@/data/use-cases'
import { type LoadSettings } from '@/domain/use-cases'
import { SettingsRepository } from '@/infra/repos/postgresql'

export const makeDbLoadSettings = (): LoadSettings => {
  const settingsRepository = new SettingsRepository()
  const dependencies: LoadSettings.Dependencies = {
    settingsRepository
  }
  const dbLoadSettings = new DbLoadSettings(dependencies)
  return dbLoadSettings
}
