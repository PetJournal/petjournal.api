import { type UpdateSettingsRepository, type LoadSettingsRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type ResultResponse } from '@/domain/types/result'

export interface UpdateSettings {
  update: (params: UpdateSettings.Params) => Promise<UpdateSettings.Result>
}

export namespace UpdateSettings {
  export type Params = {
    guardianId: string
    notificationEmail: boolean
    notificationMobile: boolean
  }

  type Data = {
    guardianId: string
    notificationEmail: boolean
    notificationMobile: boolean
  }

  export type Result = ResultResponse<Data>

  export type Dependencies = {
    guardianRepository: LoadGuardianByIdRepository
    settingsRepository: UpdateSettingsRepository & LoadSettingsRepository
  }
}
