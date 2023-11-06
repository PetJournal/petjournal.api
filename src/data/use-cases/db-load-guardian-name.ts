import { type LoadGuardianName } from '@/domain/use-cases'
import { type LoadGuardianByIdRepository } from '@/data/protocols'

export class DbLoadGuardianName implements LoadGuardianName {
  private readonly guardianRepository: LoadGuardianByIdRepository

  constructor ({ guardianRepository }: DbLoadGuardianName.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async load (userId: LoadGuardianName.Params): Promise<LoadGuardianName.Result> {
    const guardian = await this.guardianRepository.loadById(userId)
    if (!guardian) {
      return null
    }
    return { firstName: guardian.firstName, lastName: guardian.lastName }
  }
}

export namespace DbLoadGuardianName {
  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
  }
}
