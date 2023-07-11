import { type GetGuardianName } from '@/domain/use-cases'
import { type LoadGuardianByIdRepository } from '../protocols'

export class DbGetGuardianName implements GetGuardianName {
  private readonly guardianRepository: LoadGuardianByIdRepository

  constructor ({ guardianRepository }: DbGetGuardianName.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async load (userId: GetGuardianName.Params): Promise<GetGuardianName.Result> {
    const guardian = await this.guardianRepository.loadById(userId)
    if (!guardian) {
      return undefined
    }
    return { firstName: guardian.firstName, lastName: guardian.lastName }
  }
}

export namespace DbGetGuardianName {
  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
  }
}
