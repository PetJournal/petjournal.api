import { type UpdateSettingsRepository, type LoadSettingsRepository, type LoadGuardianByIdRepository } from '@/data/protocols'

export interface UpdateSettings {
  update: (params: UpdateSettings.Params) => Promise<UpdateSettings.Result>
}

export namespace UpdateSettings {
  export type Params = {
    guardianId: string
    notificationEmail: boolean
    notificationMobile: boolean
  }

  export type Result = {
    isSuccess: boolean
    data?: UpdateSettingsRepository.Result
    error?: Error
  }

  export type Dependencies = {
    guardianRepository: LoadGuardianByIdRepository
    settingsRepository: UpdateSettingsRepository & LoadSettingsRepository
  }
}
