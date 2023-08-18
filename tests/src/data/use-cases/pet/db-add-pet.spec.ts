import { NotFoundError } from '@/application/errors'
import { type AddPetRepository, type LoadGuardianByIdRepository, type LoadSpecieByNameRepository } from '@/data/protocols'
import { DbAddPet } from '@/data/use-cases'
import { type AppointOtherSpecie, type AddPet } from '@/domain/use-cases'
import {
  makeFakeAppointOtherSpecieUseCase,
  makeFakeGuardianRepository,
  makeFakePetRepository,
  makeFakeSpecieRepository,
  mockFakeGuardianAdded,
  mockFakePetAdded,
  mockFakeSpecieAdded
} from '@/tests/utils'

interface SutTypes {
  sut: DbAddPet
  guardianRepositoryStub: LoadGuardianByIdRepository
  specieRepositoryStub: LoadSpecieByNameRepository
  petRepositoryStub: AddPetRepository
  appointOtherSpecieStub: AppointOtherSpecie
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const specieRepositoryStub = makeFakeSpecieRepository()
  const petRepositoryStub = makeFakePetRepository()
  const appointOtherSpecieStub = makeFakeAppointOtherSpecieUseCase()

  const sut = new DbAddPet({
    guardianRepository: guardianRepositoryStub,
    specieRepository: specieRepositoryStub,
    petRepository: petRepositoryStub,
    appointOtherSpecie: appointOtherSpecieStub
  })

  return {
    sut,
    guardianRepositoryStub,
    specieRepositoryStub,
    petRepositoryStub,
    appointOtherSpecieStub
  }
}

describe('DbAddPet Use Case', () => {
  const params: AddPet.Params = {
    guardianId: 'any_guardian_id',
    specieName: 'any_specie_name',
    otherAlias: null
  }

  describe('GuardianRepository', () => {
    it('Should call loadById method with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')

      await sut.add(params)

      expect(loadByIdSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should return not found error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(undefined)

      const result = await sut.add(params)

      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('userId')
      })
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())

      const promise = sut.add(params)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('SpecieRepository', () => {
    it('Should call loadByName method with correct values', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const loadByName = jest.spyOn(specieRepositoryStub, 'loadByName')

      await sut.add(params)

      expect(loadByName).toHaveBeenCalledWith(params.specieName)
    })

    it('Should return not found error if incorrect specieName is provided', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName').mockResolvedValueOnce(undefined)

      const result = await sut.add(params)

      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('specieName')
      })
    })

    it('Should throw if loadByName method throws', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName').mockRejectedValue(new Error())

      const promise = sut.add(params)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('AppointOtherSpecie', () => {
    const existentSpecie = {
      ...mockFakeSpecieAdded(),
      name: 'existent_specie'
    }
    const appointedSpecie = {
      ...existentSpecie,
      otherAlias: null
    }

    it('Should call appoint method with correct values', async () => {
      const { sut, appointOtherSpecieStub } = makeSut()
      const appointSpy = jest.spyOn(appointOtherSpecieStub, 'appoint')

      await sut.add(params)

      expect(appointSpy).toHaveBeenCalledWith({
        ...mockFakeSpecieAdded(),
        otherAlias: params.otherAlias ?? null
      })
    })

    it('Should throws if appoint method throws', async () => {
      const { sut, appointOtherSpecieStub } = makeSut()
      jest.spyOn(appointOtherSpecieStub, 'appoint').mockRejectedValue(new Error())

      const promise = sut.add(params)

      await expect(promise).rejects.toThrow()
    })

    it('Should return correct specie if specieName is other and otherAlias is provided', async () => {
      const { sut, appointOtherSpecieStub, petRepositoryStub } = makeSut()
      const modifiedParams = {
        ...params,
        specieName: 'others',
        otherAlias: 'existent_specie'
      }

      jest.spyOn(appointOtherSpecieStub, 'appoint').mockResolvedValueOnce(appointedSpecie)
      jest.spyOn(petRepositoryStub, 'add').mockResolvedValueOnce({
        id: 'any_id',
        guardian: mockFakeGuardianAdded(),
        specie: existentSpecie
      })

      const result = await sut.add(modifiedParams)

      expect(result).toEqual({
        isSuccess: true,
        data: {
          ...mockFakePetAdded(),
          specie: appointedSpecie
        }
      })
    })

    it('Should return  otherAlias null if specieName is not other specie', async () => {
      const { sut, appointOtherSpecieStub, petRepositoryStub } = makeSut()
      const wrongParam = {
        ...params,
        otherAlias: 'any_alias'
      }
      jest.spyOn(appointOtherSpecieStub, 'appoint').mockResolvedValueOnce(appointedSpecie)
      jest.spyOn(petRepositoryStub, 'add').mockResolvedValueOnce({
        id: 'any_id',
        guardian: mockFakeGuardianAdded(),
        specie: existentSpecie
      })

      const result = await sut.add(wrongParam)

      expect(result).toEqual({
        isSuccess: true,
        data: {
          ...mockFakePetAdded(),
          specie: appointedSpecie
        }
      })
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
        otherAlias: params.otherAlias
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
