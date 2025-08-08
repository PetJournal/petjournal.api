import { type LoadSettingsRepository } from '@/data/protocols'

export interface LoadSettings {
  loadAll: (param: LoadSettings.Param) => Promise<LoadSettings.Result>
}

export namespace LoadSettings {
  export type Param = string
  export type Result = Array<{
    notificationEmail: boolean
    notificationMobile: boolean
  }>

  export type Dependencies = {
    settingsRepository: LoadSettingsRepository
  }
}
