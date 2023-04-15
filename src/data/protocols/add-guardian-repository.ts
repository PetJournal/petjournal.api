import { type IAddGuardian } from 'domain/use-cases'

export interface AddGuardianRepository {
  add: (guardian: AddGuardianRepository.Params) => Promise<AddGuardianRepository.Result>
}

export namespace AddGuardianRepository {
  export type Params = IAddGuardian
  export type Result = boolean
}
