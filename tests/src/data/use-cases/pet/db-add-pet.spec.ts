import { NotAcceptableError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { DbAddPet } from '@/data/use-cases'
import { PetGender } from '@/domain/models/pet'
import { type AppointSpecie, type AddPet } from '@/domain/use-cases'
import {
  makeFakeAppointPetUseCase,
  makeFakeAppointSpecieUseCase,
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
  petRepositoryStub: AddPetRepository
  appointSpecieStub: AppointSpecie
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const petRepositoryStub = makeFakePetRepository()
  const appointSpecieStub = makeFakeAppointSpecieUseCase()
  const appointPetStub = makeFakeAppointPetUseCase()

  const sut = new DbAddPet({
    guardianRepository: guardianRepositoryStub,
    petRepository: petRepositoryStub,
    appointPet: appointPetStub
  })

  return {
    sut,
    guardianRepositoryStub,
    petRepositoryStub,
    appointSpecieStub
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
    castrated: false
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
        castrated: false
      })
    })

    it('Should throw if add method throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'add').mockRejectedValue(new Error())

      const promise = sut.add(params)

      await expect(promise).rejects.toThrow()
    })
  })

  it('Should return pet data when saving the pet successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.add(params)

    expect(result).toEqual({
      isSuccess: true,
      data: mockFakePetAdded()
    })
  })
})
