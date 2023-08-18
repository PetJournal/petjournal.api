import { NotFoundError } from '@/application/errors'
import { type LoadSpecieByNameRepository, type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'
import { type AppointOtherSpecie, type AddPet } from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: AddPetRepository
  private readonly specieRepository: LoadSpecieByNameRepository
  private readonly appointOtherSpecie: AppointOtherSpecie

  constructor ({
    guardianRepository,
    petRepository,
    specieRepository,
    appointOtherSpecie
  }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
    this.specieRepository = specieRepository
    this.appointOtherSpecie = appointOtherSpecie
  }

  async add (petData: AddPet.Params): Promise<AddPet.Result> {
    const guardian = await this.guardianRepository.loadById(petData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotFoundError('userId')
      }
    }
    const specie = await this.specieRepository.loadByName(petData.specieName)
    if (!specie) {
      return {
        isSuccess: false,
        error: new NotFoundError('specieName')
      }
    }
    const specieAppointed = await this.appointOtherSpecie.appoint({
      ...specie,
      otherAlias: petData.otherAlias ?? null
    })
    const pet = await this.petRepository.add({
      guardianId: guardian.id,
      specieId: specieAppointed.id,
      otherAlias: specieAppointed.otherAlias as string
    })
    return {
      isSuccess: true,
      data: {
        id: pet?.id as string,
        guardian: pet?.guardian as Guardian & { id: string },
        specie: pet?.specie as Specie & { id: string }
      }
    }
  }
}
