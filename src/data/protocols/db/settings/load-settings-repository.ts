
export interface LoadSettingsRepository {
  loadAll: (param: LoadSettingsRepository.Param) => Promise<LoadSettingsRepository.Result>
}

export namespace LoadSettingsRepository {
  export type Param = string
  export type Result = Array<{
    id: string
    guardianId: string
    notification_email: boolean
    notification_mobile: boolean
  }>
}
