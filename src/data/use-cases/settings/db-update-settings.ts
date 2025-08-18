import { MissingParamError, NotAcceptableError } from '@/application/errors'
import { type LoadSettingsRepository, type LoadGuardianByIdRepository, type UpdateSettingsRepository } from '@/data/protocols'
import { type UpdateSettings } from '@/domain/use-cases'

export class DbUpdateSettings implements UpdateSettings {
  private readonly settingsRepository: UpdateSettingsRepository & LoadSettingsRepository
  private readonly guardianRepository: LoadGuardianByIdRepository

  constructor ({ settingsRepository, guardianRepository }: UpdateSettings.Dependencies) {
    this.settingsRepository = settingsRepository
    this.guardianRepository = guardianRepository
  }

  async update (params: UpdateSettings.Params): Promise<UpdateSettings.Result> {
    const guardian = await this.guardianRepository.loadById(params.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('userId')
      }
    }
    const [settings] = await this.settingsRepository.loadAll(params.guardianId)
    if (!settings) {
      return {
        isSuccess: false,
        error: new MissingParamError('settings')
      }
    }
    const updatedSettings = await this.settingsRepository.update({
      guardianId: guardian.id,
      notificationEmail: params.notificationEmail === undefined ? settings.notificationEmail : params.notificationEmail,
      notificationMobile: params.notificationMobile === undefined ? settings.notificationMobile : params.notificationMobile
    })
    return {
      isSuccess: true,
      data: {
        guardianId: updatedSettings.guardianId,
        notificationEmail: updatedSettings.notificationEmail,
        notificationMobile: updatedSettings.notificationMobile
      }
    }
  }
}
