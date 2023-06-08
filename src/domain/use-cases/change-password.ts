import {
  type HashGenerator,
  type UpdateGuardianPasswordRepository,
  type LoadGuardianByIdRepository
} from '@/data/protocols'

export interface ChangePassword {
  change: (userData: ChangePassword.Params) => Promise<ChangePassword.Result>
}

export namespace ChangePassword {
  export interface Params {
    id: string
    password: string
  }

  export interface Result {
    isSuccess: boolean
    error?: Error
  }

  export interface Dependencies {
    loadGuardianByIdRepository: LoadGuardianByIdRepository
    hashGenerator: HashGenerator
    updateGuardianPasswordRepository: UpdateGuardianPasswordRepository
  }
}
