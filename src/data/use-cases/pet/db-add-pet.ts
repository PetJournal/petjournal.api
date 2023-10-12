import { NotAcceptableError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'
import { type AppointSpecie, type AddPet } from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: AddPetRepository
  private readonly appointSpecie: AppointSpecie

  constructor ({
    guardianRepository,
    petRepository,
    appointSpecie
  }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
    this.appointSpecie = appointSpecie
  }

  async add (petData: AddPet.Params): Promise<AddPet.Result> {
    const guardian = await this.guardianRepository.loadById(petData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('userId')
      }
    }
    const { specie, specieAlias } = await this.appointSpecie.appoint(petData.specieName)
    const pet = await this.petRepository.add({
      guardianId: guardian.id,
      specieId: specie.id,
      specieAlias
    })
    return {
      isSuccess: true,
      data: {
        id: pet?.id as string,
        guardian: pet?.guardian as Guardian & { id: string },
        specie: pet?.specie as Specie & { id: string },
        specieAlias: pet?.specieAlias
      }
    }
  }
}
