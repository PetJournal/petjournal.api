import { NotFoundError } from '@/application/errors'
import { type LoadGuardianByIdRepository } from '@/data/protocols'
import { type AddPet } from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository

  constructor ({ guardianRepository }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async add (petData: AddPet.Params): Promise<AddPet.Result> {
    const guardian = await this.guardianRepository.loadById(petData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotFoundError('userId')
      }
    }
    return {
      isSuccess: true,
      specie: {
        id: '1',
        name: 'any_specie'
      }
    }
  }
}
