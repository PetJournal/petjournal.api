import { NotAcceptableError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import {
  type PetGender,
  type Guardian,
  type Specie,
  type Breed,
  type Size
} from '@/domain/models'
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
    const appointResult = await this.appointPet.appoint({
      specieName: petData.specieName,
      breedName: petData.breedName,
      size: petData.size,
      castrated: petData.castrated
    })
    if (appointResult.error) {
      return {
        isSuccess: false,
        error: appointResult.error
      }
    }
    const { petName, gender } = petData
    const pet = await this.petRepository.add({
      guardianId: guardian.id,
      specieId: appointResult.data?.specie.id as string,
      specieAlias: appointResult.data?.specieAlias,
      petName,
      gender,
      breedId: appointResult.data?.breed.id as string,
      breedAlias: appointResult.data?.breedAlias as string,
      sizeId: appointResult.data?.size.id as string,
      castrated: appointResult.data?.castrated as boolean
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
