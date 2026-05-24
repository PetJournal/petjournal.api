import { type FileStorage, type AddGuardianRepository, type HashGenerator } from '@/data/protocols'
import { type UpdateGuardianImageRepository } from '@/data/protocols/db/guardian/update-guardian-image-repository'

export interface AddGuardian {
  add: (guardianData: AddGuardian.Params) => Promise<AddGuardian.Result>
}

export namespace AddGuardian {
  export type Params = {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    verificationToken: string
    image: Buffer | null
  }

  export type Result = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    image: string
  } | undefined

  export type Dependencies = {
    guardianRepository: AddGuardianRepository & UpdateGuardianImageRepository
    hashService: HashGenerator
    fileStorage: FileStorage
    defaultGuardianImageUrl: string
  }
}
