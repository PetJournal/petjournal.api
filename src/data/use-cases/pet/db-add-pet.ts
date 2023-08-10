import { NotFoundError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type AddPet } from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: AddPetRepository

  constructor ({ guardianRepository, petRepository }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
  }

  async add (petData: AddPet.Params): Promise<AddPet.Result> {
    const guardian = await this.guardianRepository.loadById(petData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotFoundError('userId')
      }
    }
    await this.petRepository.add(petData)
    return {
      isSuccess: true,
      specie: {
        id: 'any_specie_id',
        name: 'any_specie'
      }
    }
  }
}
