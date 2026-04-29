import { NotAcceptableError } from '@/application/errors'
import { type UpdatePetRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository, type FileStorage, type DeleteFileStorage } from '@/data/protocols'
import { type PetGender } from '@/domain/models'
import { type UpdatePet, type AppointPet } from '@/domain/use-cases'
export class DbUpdatePet implements UpdatePet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: UpdatePetRepository & LoadPetByIdRepository
  private readonly fileStorage: FileStorage & DeleteFileStorage
  private readonly appointPet: AppointPet

  constructor ({
    guardianRepository,
    petRepository,
    fileStorage,
    appointPet
  }: UpdatePet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
    this.fileStorage = fileStorage
    this.appointPet = appointPet
  }

  async update (petData: UpdatePet.Params): Promise<UpdatePet.Result> {
    const guardian = await this.guardianRepository.loadById(petData.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('userId')
      }
    }
    const pet = await this.petRepository.loadById({ guardianId: petData.guardianId, petId: petData.petId })
    if (!pet) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('petId')
      }
    }
    const appointResult = await this.appointPet.appoint({
      specieName: petData.specieName ? petData.specieName : pet.specie.name,
      breedName: petData.breedName ? petData.breedName : pet.breed.name,
      size: petData.size ? petData.size : pet.size.name,
      castrated: typeof petData.castrated === 'boolean' ? petData.castrated : pet.castrated
    })
    if (!appointResult.isSuccess) {
      return {
        isSuccess: false,
        error: appointResult.error
      }
    }

    let finalImage: string = ''
    if (petData.image) {
      const currentImage = pet.image
      const updatedImage = await this.fileStorage.save({ file: petData.image, fileName: `images/pet-${pet?.id}-${Math.trunc(Date.now() / 1000)}` })
      if (!updatedImage) {
        return {
          isSuccess: false,
          error: new NotAcceptableError('update image failed')
        }
      }
      if (currentImage) {
        await this.fileStorage.delete({ fileUrlOrPath: currentImage })
      }
      finalImage = updatedImage
    }
    if (!petData.image) {
      finalImage = pet.image
    }

    const petUpdateResult = await this.petRepository.update({
      guardianId: guardian.id,
      petId: pet.id,
      specieId: appointResult.data.specie.id,
      specieAlias: appointResult.data.specieAlias,
      petName: petData.petName ? petData.petName : pet.petName,
      gender: petData.gender ? petData.gender : pet.gender as PetGender,
      breedId: appointResult.data.breed.id,
      breedAlias: appointResult.data.breedAlias,
      sizeId: appointResult.data.size.id,
      castrated: appointResult.data.castrated,
      dateOfBirth: petData.dateOfBirth ? petData.dateOfBirth : pet.dateOfBirth,
      image: finalImage
    })
    if (!petUpdateResult) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('update error')
      }
    }

    return {
      isSuccess: true,
      data: {
        id: petUpdateResult.id,
        guardian: petUpdateResult.guardian,
        specie: petUpdateResult.specie,
        specieAlias: petUpdateResult.specieAlias,
        petName: petUpdateResult.petName,
        gender: petUpdateResult.gender,
        breed: petUpdateResult.breed,
        breedAlias: petUpdateResult.breedAlias,
        size: petUpdateResult.size,
        castrated: petUpdateResult.castrated,
        dateOfBirth: petUpdateResult.dateOfBirth,
        image: petUpdateResult.image
      }
    }
  }
}
