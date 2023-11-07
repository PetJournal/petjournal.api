import { type AddGuardian } from '@/domain/use-cases'
import {
  type LoadGuardianByEmailRepository,
  type AddGuardianRepository,
  type HashGenerator,
  type LoadGuardianByPhoneRepository
} from '@/data/protocols'

export class DbAddGuardian implements AddGuardian {
  private readonly guardianRepository: AddGuardianRepository & LoadGuardianByEmailRepository & LoadGuardianByPhoneRepository
  private readonly hashService: HashGenerator

  constructor ({ guardianRepository, hashService }: AddGuardian.Dependencies) {
    this.guardianRepository = guardianRepository
    this.hashService = hashService
  }

  async add (guardianData: AddGuardian.Params): Promise<AddGuardian.Result> {
    const guardianHasEmailRegistered = await this.guardianRepository.loadByEmail(guardianData.email)
    if (guardianHasEmailRegistered) {
      return undefined
    }
    const guardianHasPhoneRegistered = await this.guardianRepository.loadByPhone(guardianData.phone)
    if (guardianHasPhoneRegistered) {
      return undefined
    }
    const hashedPassword = await this.hashService.encrypt({ value: guardianData.password })
    return await this.guardianRepository.add(Object.assign({}, guardianData, { password: hashedPassword }))
  }
}
