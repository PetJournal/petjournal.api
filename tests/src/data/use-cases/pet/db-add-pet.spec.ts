import { NotAcceptableError } from '@/application/errors'
import { type FileStorage, type AddPetRepository, type LoadGuardianByIdRepository, type UpdatePetRepository } from '@/data/protocols'
import { DbAddPet } from '@/data/use-cases'
import { PetGender } from '@/domain/models/pet'
import { type AddPet, type AppointPet } from '@/domain/use-cases'
import {
  makeFakeAppointPetUseCase,
  makeFakeFileStorage,
  makeFakeGuardianRepository,
  makeFakePetRepository,
  mockFakeBreedAdded,
  mockFakeGuardianAdded,
  mockFakePetAdded,
  mockFakeSizeAdded,
  mockFakeSpecieAdded
} from '@/tests/utils'

interface SutTypes {
  sut: DbAddPet
  guardianRepositoryStub: LoadGuardianByIdRepository
  petRepositoryStub: AddPetRepository & UpdatePetRepository
  appointPetStub: AppointPet
  fileStorageStub: FileStorage
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const petRepositoryStub = makeFakePetRepository()
  const appointPetStub = makeFakeAppointPetUseCase()
  const fileStorageStub = makeFakeFileStorage()

  const sut = new DbAddPet({
    guardianRepository: guardianRepositoryStub,
    petRepository: petRepositoryStub,
    appointPet: appointPetStub,
    fileStorage: fileStorageStub
  })

  return {
    sut,
    guardianRepositoryStub,
    petRepositoryStub,
    appointPetStub,
    fileStorageStub
  }
}

describe('DbAddPet Use Case', () => {
  const params: AddPet.Params = {
    guardianId: 'any_guardian_id',
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
    it('Should call loadById method with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')

      await sut.add(params)

      expect(loadByIdSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should return not acceptable error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)

      const result = await sut.add(params)

      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('userId')
      })
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())

      const promise = sut.add(params)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('PetRepository', () => {
    describe('Add Method', () => {
      it('Should call add method with correct values', async () => {
        const { sut, petRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(petRepositoryStub, 'add')

        await sut.add(params)

        expect(addSpy).toHaveBeenCalledWith({
          guardianId: mockFakeGuardianAdded().id,
          specieId: mockFakeSpecieAdded().id,
          specieAlias: 'any_specie_alias',
          petName: params.petName,
          gender: params.gender,
          breedId: mockFakeBreedAdded().id,
          breedAlias: 'any_breed_alias',
          sizeId: mockFakeSizeAdded().id,
          castrated: false,
          dateOfBirth: params.dateOfBirth
        })
      })

      it('Should return not acceptable error if wrong breed or size is provided to cat or dog', async () => {
        const { sut, appointPetStub } = makeSut()
        jest.spyOn(appointPetStub, 'appoint').mockResolvedValueOnce({
          isSuccess: false,
          error: new NotAcceptableError('any_breed_name')
        })

        const result = await sut.add(params)

        expect(result).toEqual({
          isSuccess: false,
          error: new NotAcceptableError('any_breed_name')
        })
      })

      it('Should throw if add method throws', async () => {
        const { sut, petRepositoryStub } = makeSut()
        jest.spyOn(petRepositoryStub, 'add').mockRejectedValue(new Error())

        const promise = sut.add(params)

        await expect(promise).rejects.toThrow()
      })
    })

    describe('Update Method', () => {
      it('Should call update method with correct value', async () => {
        const { sut, petRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(petRepositoryStub, 'update')

        await sut.add(params)

        expect(updateSpy).toHaveBeenCalledWith({
          guardianId: mockFakeGuardianAdded().id,
          petId: mockFakePetAdded()?.id as string,
          image: 'any_url'
        })
      })

      it('Should not call update method if image is not provided', async () => {
        const { sut, petRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(petRepositoryStub, 'update')

        await sut.add({ ...params, image: null })

        expect(updateSpy).not.toHaveBeenCalled()
      })

      it('Should throw if update method throws', async () => {
        const { sut, petRepositoryStub } = makeSut()
        jest.spyOn(petRepositoryStub, 'update').mockRejectedValue(new Error())

        const promise = sut.add(params)

        await expect(promise).rejects.toThrow()
      })
    })
  })

  describe('FileStorage', () => {
    it('Should call save method with correct value', async () => {
      const { sut, fileStorageStub } = makeSut()
      const saveSpy = jest.spyOn(fileStorageStub, 'save')

      await sut.add(params)

      expect(saveSpy).toHaveBeenCalledWith({
        file: params.image,
        fileName: `images/pet-${mockFakePetAdded()?.id as string}`
      })
    })

    it('Should not call save method if image is not provided', async () => {
      const { sut, fileStorageStub } = makeSut()
      const saveSpy = jest.spyOn(fileStorageStub, 'save')

      await sut.add({ ...params, image: null })

      expect(saveSpy).not.toHaveBeenCalled()
    })
  })

  it('Should return pet data when saving the pet successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.add(params)

    expect(result).toEqual({
      isSuccess: true,
      data: {
        ...mockFakePetAdded(),
        image: 'any_url',
        specieAlias: 'any_specie_alias'
      }
    })
  })
})
