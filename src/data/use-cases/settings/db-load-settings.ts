import { type LoadSettingsRepository } from '@/data/protocols'
import { type LoadSettings } from '@/domain/use-cases/settings'

export class DbLoadSettings implements LoadSettings {
  private readonly settingsRepository: LoadSettingsRepository

  constructor ({ settingsRepository }: LoadSettings.Dependencies) {
    this.settingsRepository = settingsRepository
  }

  async loadAll (guardianId: LoadSettings.Param): Promise<LoadSettings.Result> {
    const settings = await this.settingsRepository.loadAll(guardianId)
    return settings
  }
}
