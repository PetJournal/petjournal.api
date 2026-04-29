import { type LoadGuardian } from '@/domain/use-cases'
import { type LoadGuardianByIdRepository } from '@/data/protocols'

export class DbLoadGuardian implements LoadGuardian {
  private readonly guardianRepository: LoadGuardianByIdRepository

  constructor ({ guardianRepository }: DbLoadGuardian.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async load (userId: LoadGuardian.Params): Promise<LoadGuardian.Result> {
    const guardian = await this.guardianRepository.loadById(userId)
    if (!guardian) {
      return null
    }
    return {
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      email: guardian.email,
      phone: guardian.phone,
      image: guardian.image
    }
  }
}

export namespace DbLoadGuardian {
  export interface Dependencies {
    guardianRepository: LoadGuardianByIdRepository
  }
}
