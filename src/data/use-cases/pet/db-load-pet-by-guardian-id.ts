import { type LoadPetByGuardianIdRepository } from '@/data/protocols'
import { type LoadPets } from '@/domain/use-cases'

export class DbLoadPetByGuardianId implements LoadPets {
  private readonly petRepository: LoadPetByGuardianIdRepository

  constructor ({ petRepository }: LoadPets.Dependencies) {
    this.petRepository = petRepository
  }

  async load ({ guardianId }: LoadPets.Params): Promise<LoadPets.Result> {
    const result = await this.petRepository.loadByGuardianId(guardianId)
    return result
  }
}
