import { NotAcceptableError } from '@/application/errors'
import { type FileStorage, type AddPetRepository, type LoadGuardianByIdRepository, type UpdatePetRepository } from '@/data/protocols'
import {
  type AddPet,
  type AppointPet
} from '@/domain/use-cases'

export class DbAddPet implements AddPet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: AddPetRepository & UpdatePetRepository
  private readonly appointPet: AppointPet
  private readonly fileStorage: FileStorage
  private readonly defaultImageUrl: string

  constructor ({
    guardianRepository,
    petRepository,
    appointPet,
    fileStorage,
    defaultImageUrl
  }: AddPet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
    this.appointPet = appointPet
    this.fileStorage = fileStorage
    this.defaultImageUrl = defaultImageUrl
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
    if (!appointResult.isSuccess) {
      return {
        isSuccess: false,
        error: appointResult.error
      }
    }

    const { petName, gender, dateOfBirth } = petData
    const pet = await this.petRepository.add({
      guardianId: guardian.id,
      specieId: appointResult.data.specie.id,
      specieAlias: appointResult.data.specieAlias,
      petName,
      gender,
      breedId: appointResult.data.breed.id,
      breedAlias: appointResult.data.breedAlias,
      sizeId: appointResult.data.size.id,
      castrated: appointResult.data.castrated,
      dateOfBirth
    })
    if (!pet) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('petData')
      }
    }

    let imageUrl: string = ''
    if (petData.image) {
      imageUrl = await this.fileStorage.save({ file: petData.image, fileName: `images/pet-${pet.id}` })
    }

    if (imageUrl) {
      await this.petRepository.update({
        guardianId: guardian.id,
        petId: pet.id,
        image: imageUrl
      })
    }

    return {
      isSuccess: true,
      data: {
        id: pet.id,
        guardian: pet.guardian,
        specie: pet.specie,
        specieAlias: pet.specieAlias,
        petName: pet.petName,
        gender: pet.gender,
        breed: pet.breed,
        breedAlias: pet.breedAlias,
        size: pet.size,
        castrated: pet.castrated,
        dateOfBirth: pet.dateOfBirth,
        image: imageUrl || this.defaultImageUrl
      }
    }
  }
}
