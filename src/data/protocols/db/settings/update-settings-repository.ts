export interface UpdateSettingsRepository {
  update: (params: UpdateSettingsRepository.Params) => Promise<UpdateSettingsRepository.Result>
}

export namespace UpdateSettingsRepository {
  export type Params = {
    guardianId: string
    notificationEmail: boolean
    notificationMobile: boolean
  }

  export type Result = {
    guardianId: string
    notificationEmail: boolean
    notificationMobile: boolean
  }
}
