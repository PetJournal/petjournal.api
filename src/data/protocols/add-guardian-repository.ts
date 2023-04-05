import { type Guardian } from 'domain/entities'
import { type IAddGuardian } from 'domain/use-cases'

export interface AddGuardianRepository {
  add: (guardian: IAddGuardian) => Promise<Guardian>
}
