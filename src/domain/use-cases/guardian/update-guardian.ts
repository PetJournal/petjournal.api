import { type DeleteFileStorage, type FileStorage, type LoadGuardianByIdRepository, type UpdateGuardianRepository } from '@/data/protocols'

export interface UpdateGuardian {
  update: (params: UpdateGuardian.Params) => Promise<UpdateGuardian.Result>
}

export namespace UpdateGuardian {
  export type Params = {
    guardianId: string
    firstName?: string
    lastName?: string
    phone?: string
    image?: Buffer | null
  }

  export type Result = {
    isSuccess: boolean
    error?: Error
    data?: UpdateGuardianRepository.Result
  }

  export type Dependencies = {
    guardianRepository: LoadGuardianByIdRepository & UpdateGuardianRepository
    fileStorage: FileStorage & DeleteFileStorage
  }
}
