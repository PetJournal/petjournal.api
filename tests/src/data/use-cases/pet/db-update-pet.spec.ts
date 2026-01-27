import { DbUpdatePet } from '@/data/use-cases'
import { type UpdatePet, type AppointPet } from '@/domain/use-cases'
import { type LoadPetByGuardianIdRepository, type LoadPetByIdRepository, type LoadGuardianByIdRepository, type FileStorage, type DeleteFileStorage } from '@/data/protocols'
import { makeFakeAppointPetUseCase, makeFakeFileStorage, makeFakeGuardianRepository, makeFakePetRepository, mockFakePetByIdLoaded, mockFakePetUpdated } from '@/tests/utils'
import { PetGender } from '@/domain/models'
import { NotAcceptableError } from '@/application/errors'

interface SutTypes {
  sut: DbUpdatePet
  guardianRepositoryStub: LoadGuardianByIdRepository
  petRepositoryStub: LoadPetByGuardianIdRepository & LoadPetByIdRepository
  appointPetStub: AppointPet
  fileStorageStub: FileStorage & DeleteFileStorage

}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const petRepositoryStub = makeFakePetRepository()
  const appointPetStub = makeFakeAppointPetUseCase()
  const fileStorageStub = makeFakeFileStorage()
  const dependencies: UpdatePet.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    petRepository: petRepositoryStub,
    appointPet: appointPetStub,
    fileStorage: fileStorageStub
  }
  const sut = new DbUpdatePet(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    petRepositoryStub,
    appointPetStub,
    fileStorageStub
  }
}

describe('DbUpdatePet Use Case', () => {
  const params: UpdatePet.Params = {
    guardianId: 'any_guardian_id',
    petId: 'any_pet_id',
    specieName: 'any_specie_name',
    gender: PetGender.MALE,
    petName: 'any_pet_name',
    breedName: 'any_breed_name',
    size: 'any_size',
    castrated: false,
    dateOfBirth: new Date(2000, 10, 23),
    image: Buffer.from('any_image')
  }

  describe('GuardianRepository', () => {
    it('Should call loadbyId method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadByIdSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should return Not Acceptable error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.update(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('userId')
      })
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('PetRepository', () => {
    it('Should call loadById method with correct values', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(petRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadByIdSpy).toHaveBeenCalledWith(params.petId)
    })

    it('Should return Not Acceptable error if incorrect petId is provided', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.update(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('petId')
      })
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('FileStorage', () => {
    it('Should call save method with correct value', async () => {
      const { sut, fileStorageStub } = makeSut()
      const saveSpy = jest.spyOn(fileStorageStub, 'save')

      await sut.update(params)

      expect(saveSpy).toHaveBeenCalledWith({
        file: params.image,
        fileName: `images/pet-${mockFakePetUpdated()?.id as string}-${Date.now()}`
      })
    })

    it('Should throw if save method throws', async () => {
      const { sut, fileStorageStub } = makeSut()
      jest.spyOn(fileStorageStub, 'save').mockRejectedValueOnce(new Error())

      const promise = sut.update(params)

      await expect(promise).rejects.toThrow()
    })

    it('Should call delete method with correct value', async () => {
      const { sut, fileStorageStub } = makeSut()
      const saveSpy = jest.spyOn(fileStorageStub, 'delete')

      await sut.update(params)

      expect(saveSpy).toHaveBeenCalledWith({
        fileUrlOrPath: 'any_image_url'
      })
    })
  })

  describe('AppointPet', () => {
    it('Should call appoint with correct values', async () => {
      const { sut, appointPetStub } = makeSut()
      const fakePet = mockFakePetByIdLoaded()
      const appointSpy = jest.spyOn(appointPetStub, 'appoint')
      await sut.update(params)
      expect(appointSpy).toHaveBeenCalledWith({
        specieName: params.specieName ? params.specieName : fakePet.specie.name,
        breedName: params.breedName ? params.breedName : fakePet.breed.name,
        size: params.size ? params.size : fakePet.size.name,
        castrated: typeof params.castrated === 'boolean' ? params.castrated : fakePet.castrated
      })
    })

    it('Should return error if incorrect values are provided', async () => {
      const { sut, appointPetStub } = makeSut()
      jest.spyOn(appointPetStub, 'appoint').mockResolvedValueOnce({
        isSuccess: false,
        error: new Error()
      })
      const result = await sut.update(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new Error()
      })
    })

    it('Should throw if appoint method throws', async () => {
      const { sut, appointPetStub } = makeSut()
      jest.spyOn(appointPetStub, 'appoint').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })
  })

  it('Should return pet data on update success', async () => {
    const { sut } = makeSut()
    const result = await sut.update(params)
    expect(result).toEqual({
      isSuccess: true,
      data: mockFakePetUpdated()
    })
  })
})
