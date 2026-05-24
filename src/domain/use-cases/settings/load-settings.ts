import { type LoadSettingsRepository } from '@/data/protocols'

export interface LoadSettings {
  loadAll: (param: LoadSettings.Param) => Promise<LoadSettings.Result>
}

export namespace LoadSettings {
  export type Param = string

  type Settings = {
    notificationEmail: boolean
    notificationMobile: boolean
  }

  export type Result = Settings[]

  export type Dependencies = {
    settingsRepository: LoadSettingsRepository
  }
}
