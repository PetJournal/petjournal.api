import {
  type HashGenerator,
  type UpdateGuardianPasswordRepository,
  type LoadGuardianByIdRepository
} from '@/data/protocols'

export interface ChangePassword {
  change: (guardianData: ChangePassword.Params) => Promise<ChangePassword.Result>
}

export namespace ChangePassword {
  export type Params = {
    id: string
    password: string
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
  }

  export type Dependencies = {
    guardianRepository: LoadGuardianByIdRepository & UpdateGuardianPasswordRepository
    hashService: HashGenerator
  }
}
