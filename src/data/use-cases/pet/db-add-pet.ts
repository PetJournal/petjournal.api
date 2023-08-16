import { NotFoundError } from '@/application/errors'
import { type LoadSpecieByIdRepository, type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type AddPet } from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: AddPetRepository
  private readonly specieRepository: LoadSpecieByIdRepository

  constructor ({ guardianRepository, petRepository, specieRepository }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
    this.specieRepository = specieRepository
  }

  async add (petData: AddPet.Params): Promise<AddPet.Result> {
    const guardian = await this.guardianRepository.loadById(petData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotFoundError('userId')
      }
    }
    const specie = await this.specieRepository.loadById(petData.specieId)
    if (!specie) {
      return {
        isSuccess: false,
        error: new NotFoundError('specieId')
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
