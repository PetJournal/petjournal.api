import { type LoadSettingsRepository } from '@/data/protocols'

export interface LoadSettings {
  loadAll: (param: LoadSettings.Param) => Promise<LoadSettings.Result>
}

export namespace LoadSettings {
  export type Param = string
  export type Result = Array<{
    notification_email: boolean
    notification_mobile: boolean
  }>

  export type Dependencies = {
    settingsRepository: LoadSettingsRepository
  }
}
