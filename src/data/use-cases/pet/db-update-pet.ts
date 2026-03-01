import { NotAcceptableError } from '@/application/errors'
import { type UpdatePetRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository, type FileStorage, type DeleteFileStorage } from '@/data/protocols'
import {
  type PetGender,
  type Guardian,
  type Specie,
  type Breed,
  type Size
} from '@/domain/models'
import {
  type UpdatePet,
  type AppointPet
} from '@/domain/use-cases'

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
    const pet = await this.petRepository.loadById(petData.petId)
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
    if (appointResult.error) {
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
      specieId: appointResult.data?.specie.id as string,
      specieAlias: appointResult.data?.specieAlias,
      petName: petData.petName ? petData.petName : pet.petName,
      gender: petData.gender ? petData.gender : pet.gender as PetGender,
      breedId: appointResult.data?.breed.id as string,
      breedAlias: appointResult.data?.breedAlias as string,
      sizeId: appointResult.data?.size.id as string,
      castrated: appointResult.data?.castrated as boolean,
      dateOfBirth: petData.dateOfBirth ? petData.dateOfBirth : pet.dateOfBirth,
      image: finalImage
    })

    return {
      isSuccess: true,
      data: {
        id: petUpdateResult?.id as string,
        guardian: petUpdateResult?.guardian as Guardian & { id: string },
        specie: petUpdateResult?.specie as Specie & { id: string },
        specieAlias: petUpdateResult?.specieAlias,
        petName: petUpdateResult?.petName as string,
        gender: petUpdateResult?.gender as PetGender,
        breed: petUpdateResult?.breed as Breed & { id: string },
        breedAlias: petUpdateResult?.breedAlias as string,
        size: petUpdateResult?.size as Size & { id: string },
        castrated: petUpdateResult?.castrated as boolean,
        dateOfBirth: petUpdateResult?.dateOfBirth as Date,
        image: petUpdateResult?.image as string
      }
    }
  }
}
