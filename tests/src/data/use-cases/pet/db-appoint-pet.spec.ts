import { type LoadBreedByNameRepository, type LoadSizeByNameRepository, type LoadSpecieByNameRepository } from '@/data/protocols'
import { DbAppointPet } from '@/data/use-cases/pet/db-appoint-pet'
import { type AppointPet } from '@/domain/use-cases'
import { makeFakeBreedRepository, makeFakeSizeRepository, makeFakeSpecieRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbAppointPet
  specieRepositoryStub: LoadSpecieByNameRepository
  breedRepositoryStub: LoadBreedByNameRepository
  sizeRepositoryStub: LoadSizeByNameRepository
}

const makeSut = (): SutTypes => {
  const dependencies: AppointPet.Dependencies = {
    specieRepository: makeFakeSpecieRepository(),
    breedRepository: makeFakeBreedRepository(),
    sizeRepository: makeFakeSizeRepository()
  }
  const sut = new DbAppointPet(dependencies)
  return {
    sut,
    specieRepositoryStub: dependencies.specieRepository,
    breedRepositoryStub: dependencies.breedRepository,
    sizeRepositoryStub: dependencies.sizeRepository
  }
}

describe('DbAppointPet Use Case', () => {
  const params: AppointPet.Params = {
    specieName: 'any_name',
    breedName: 'any_name',
    size: 'any_name'
  }
  describe('SpecieRepository', () => {
    test('should return specie Outros and especieAlias equal specieName when specieName is not in db', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const otherSpecie = {
        id: 'any_id',
        name: 'Outros'
      }
      const anyBreed = {
        id: 'any_id',
        name: 'any_name'
      }
      const anySize = {
        id: 'any_id',
        name: 'any_name'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(otherSpecie)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: otherSpecie,
        specieAlias: params.specieName,
        breed: anyBreed,
        breedAlias: '',
        size: anySize
      })
    })

    test('should return specie and specieAlias equal Outros when specieName is equal Outros', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const otherSpecie = {
        id: 'any_id',
        name: 'Outros'
      }
      const anyBreed = {
        id: 'any_id',
        name: 'any_name'
      }
      const anySize = {
        id: 'any_id',
        name: 'any_name'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(otherSpecie)
      const result = await sut.appoint({ ...params, specieName: 'Outros' })
      expect(result).toEqual({
        specie: otherSpecie,
        specieAlias: 'Outros',
        breed: anyBreed,
        breedAlias: '',
        size: anySize
      })
    })
    test('should call loadByName with correct param', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const spySpecieRepository = jest.spyOn(specieRepositoryStub, 'loadByName')
      await sut.appoint(params)
      expect(spySpecieRepository).toHaveBeenCalledWith(params.specieName)
    })

    test('should throw when loadByName throws', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName').mockRejectedValueOnce(new Error())
      const promise = sut.appoint(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('BreedRepository', () => {
    test('should return breed Sem raça when specieName is Outros', async () => {
      const { sut, specieRepositoryStub, breedRepositoryStub } = makeSut()
      const otherSpecie = {
        id: 'any_id',
        name: 'Outros'
      }
      const otherBreed = {
        id: 'any_id',
        name: 'Sem raça'
      }
      const anySize = {
        id: 'any_id',
        name: 'any_name'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(otherSpecie)
      jest.spyOn(breedRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(otherBreed)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: otherSpecie,
        specieAlias: params.specieName,
        breed: otherBreed,
        breedAlias: '',
        size: anySize
      })
    })

    test('should return breed Sem raça when specieName is not Outros, Gato or Cachorro', async () => {
      const { sut, specieRepositoryStub, breedRepositoryStub } = makeSut()
      const specieWithoutBreed = {
        id: 'any_id',
        name: 'Pássaro'
      }
      const withoutBreed = {
        id: 'any_id',
        name: 'Sem raça Pássaro'
      }
      const anySize = {
        id: 'any_id',
        name: 'any_name'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(specieWithoutBreed)
      jest.spyOn(breedRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(withoutBreed)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: specieWithoutBreed,
        specieAlias: undefined,
        breed: withoutBreed,
        breedAlias: '',
        size: anySize
      })
    })

    test('should return breed Outra raça when specie is cat or dog and breedName is any breed', async () => {
      const { sut, specieRepositoryStub, breedRepositoryStub } = makeSut()
      const specieWithBreed = {
        id: 'any_id',
        name: 'Gato'
      }
      const otherBreed = {
        id: 'any_id',
        name: 'péduro'
      }
      const anySize = {
        id: 'any_id',
        name: 'any_name'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(specieWithBreed)
      jest.spyOn(breedRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(otherBreed)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: specieWithBreed,
        specieAlias: undefined,
        breed: otherBreed,
        breedAlias: params.breedName,
        size: anySize
      })
    })
  })
})
