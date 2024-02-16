import { NotAcceptableError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type PetGender } from '@/domain/models/pet'
import { type Guardian } from '@/domain/models/guardian'
import { type Specie } from '@/domain/models/specie'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'
import {
  type AddPet,
  type AppointPet
} from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: AddPetRepository
  private readonly appointPet: AppointPet

  constructor ({
    guardianRepository,
    petRepository,
    appointPet
  }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
    this.appointPet = appointPet
  }

  async add (petData: AddPet.Params): Promise<AddPet.Result> {
    const guardian = await this.guardianRepository.loadById(petData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('userId')
      }
    }
    const {
      specie,
      specieAlias,
      breed,
      breedAlias,
      size,
      castrated
    } = await this.appointPet.appoint({
      specieName: petData.specieName,
      breedName: petData.breedName,
      size: petData.size,
      castrated: petData.castrated
    })
    const { petName, gender } = petData
    const pet = await this.petRepository.add({
      guardianId: guardian.id,
      specieId: specie.id,
      specieAlias,
      petName,
      gender,
      breedId: breed.id,
      breedAlias,
      sizeId: size.id,
      castrated
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
        size: pet?.size as Size & { id: string },
        castrated: pet?.castrated as boolean
      }
    }
  }
}
