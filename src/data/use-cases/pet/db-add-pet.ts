import { NotFoundError } from '@/application/errors'
import { type LoadSpecieByIdRepository, type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'
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
    const pet = await this.petRepository.add(petData)
    return {
      isSuccess: true,
      data: {
        id: pet?.id as string,
        guardian: pet?.guardian as Guardian,
        specie: pet?.specie as Specie
      }
    }
  }
}
