import { NotAcceptableError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type PetGender } from '@/domain/models/pet'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'
import {
  type AppointSpecie,
  type AddPet,
  type AppointBreed
} from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: AddPetRepository
  private readonly appointSpecie: AppointSpecie
  private readonly appointBreed: AppointBreed

  constructor ({
    guardianRepository,
    petRepository,
    appointSpecie,
    appointBreed
  }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
    this.appointSpecie = appointSpecie
    this.appointBreed = appointBreed
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
    const { breed, breedAlias } = await this.appointBreed.appoint(petData.breedName)
    const { petName, gender, size } = petData
    const pet = await this.petRepository.add({
      guardianId: guardian.id,
      specieId: specie.id,
      specieAlias,
      petName,
      gender,
      breedId: breed.id,
      breedAlias,
      sizeId: size
    })
    return {
      isSuccess: true,
      data: {
        id: pet?.id as string,
        guardian: pet?.guardian as Guardian & { id: string },
        specie: pet?.specie as Specie & { id: string },
        specieAlias: pet?.specieAlias,
        petName: pet?.petName as string,
        gender: pet?.gender as PetGender,
        breed: pet?.breed as Breed & { id: string },
        breedAlias: pet?.breedAlias as string,
        size: pet?.size as Size & { id: string }
      }
    }
  }
}
