import { NotFoundError } from '@/application/errors'
import { type LoadSpecieByIdRepository, type AddPetRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { DbAddPet } from '@/data/use-cases'
import { type AppointOtherSpecie, type AddPet } from '@/domain/use-cases'
import { makeFakeAppointOtherSpecieUseCase, makeFakeGuardianRepository, makeFakePetRepository, makeFakeSpecieRepository, mockFakePetAdded, mockFakeSpecieAdded } from '@/tests/utils'

interface SutTypes {
  sut: DbAddPet
  guardianRepositoryStub: LoadGuardianByIdRepository
  specieRepositoryStub: LoadSpecieByIdRepository
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
    specieId: 'any_specie_id',
    otherAlias: 'any_other_alias'
  }

  describe('GuardianRepository', () => {
    it('Should call loadById method with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadById')

      await sut.add(params)

      expect(loadByEmailSpy).toHaveBeenCalledWith(params.guardianId)
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
    it('Should call loadById method with correct values', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(specieRepositoryStub, 'loadById')

      await sut.add(params)

      expect(loadByEmailSpy).toHaveBeenCalledWith(params.specieId)
    })

    it('should return not found error if incorrect specieId is provided', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadById').mockResolvedValueOnce(undefined)

      const result = await sut.add(params)

      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('specieId')
      })
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadById').mockRejectedValue(new Error())

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
        guardianId: params.guardianId,
        specieId: params.specieId,
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

  describe('AppointOtherSpecie', () => {
    it('Should set otherAlias null if specieId is not other specie', async () => {
      const { sut, appointOtherSpecieStub, specieRepositoryStub } = makeSut()
      const wrongParam = {
        ...params,
        otherAlias: 'any_alias'
      }
      const specieDifferentOfOther = {
        ...mockFakeSpecieAdded(),
        name: 'different_of_other_specie'
      }
      jest.spyOn(specieRepositoryStub, 'loadById').mockResolvedValueOnce(specieDifferentOfOther)
      jest.spyOn(appointOtherSpecieStub, 'appoint').mockResolvedValueOnce({
        ...specieDifferentOfOther,
        otherAlias: null
      })

      const result = await sut.add(wrongParam)

      expect(result).toEqual({
        isSuccess: true,
        data: {
          ...mockFakePetAdded(),
          specie: {
            ...specieDifferentOfOther,
            otherAlias: null
          }
        }
      })
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
