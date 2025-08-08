
export interface LoadSettingsRepository {
  loadAll: (param: LoadSettingsRepository.Param) => Promise<LoadSettingsRepository.Result>
}

export namespace LoadSettingsRepository {
  export type Param = string
  export type Result = Array<{
    notificationEmail: boolean
    notificationMobile: boolean
  }>
}
