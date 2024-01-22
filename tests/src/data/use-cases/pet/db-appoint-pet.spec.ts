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

  const petResult = {
    anySpecie: {
      id: 'any_id',
      name: 'any_name'
    },
    otherSpecie: {
      id: 'any_id',
      name: 'Outros'
    },
    anyBreed: {
      id: 'any_id',
      name: 'any_name'
    },
    anySize: {
      id: 'any_id',
      name: 'any_name'
    }
  }

  describe('SpecieRepository', () => {
    test('should return specie Outros and especieAlias equal specieName when specieName is not in db', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(petResult.otherSpecie)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: petResult.otherSpecie,
        specieAlias: params.specieName,
        breed: petResult.anyBreed,
        breedAlias: '',
        size: petResult.anySize
      })
    })

    test('should return specie and specieAlias equal Outros when specieName is equal Outros', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(petResult.otherSpecie)
      const result = await sut.appoint({ ...params, specieName: 'Outros' })
      expect(result).toEqual({
        specie: petResult.otherSpecie,
        specieAlias: 'Outros',
        breed: petResult.anyBreed,
        breedAlias: '',
        size: petResult.anySize
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
      const otherBreed = {
        id: 'any_id',
        name: 'Sem raça'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(petResult.otherSpecie)
      jest.spyOn(breedRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(otherBreed)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: petResult.otherSpecie,
        specieAlias: params.specieName,
        breed: otherBreed,
        breedAlias: '',
        size: petResult.anySize
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
        size: petResult.anySize
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
        size: petResult.anySize
      })
    })

    test('should return breed Outra raça when specie is cat or dog and breedName is Outra raça', async () => {
      const { sut, specieRepositoryStub, breedRepositoryStub } = makeSut()
      const specieWithBreed = {
        id: 'any_id',
        name: 'Gato'
      }
      const otherBreed = {
        id: 'any_id',
        name: 'Outra raça Gato'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(specieWithBreed)
      jest.spyOn(breedRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(otherBreed)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: specieWithBreed,
        specieAlias: undefined,
        breed: otherBreed,
        breedAlias: otherBreed.name,
        size: petResult.anySize
      })
    })

    test('should return breed when specie is cat or dog and breedName is equal to breed in db', async () => {
      const { sut, specieRepositoryStub, breedRepositoryStub } = makeSut()
      const specieWithBreed = {
        id: 'any_id',
        name: 'Gato'
      }
      const breed = {
        id: 'any_id',
        name: 'Abissínio'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(specieWithBreed)
      jest.spyOn(breedRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(breed)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: specieWithBreed,
        specieAlias: undefined,
        breed,
        breedAlias: '',
        size: petResult.anySize
      })
    })
  })

  describe('SizeRepository', () => {
    test('should return size Sem porte specieName when specie is not cat or dog', async () => {
      const { sut, specieRepositoryStub, sizeRepositoryStub } = makeSut()
      const specieWithoutSize = {
        id: 'any_id',
        name: 'Pássaro'
      }
      const size = {
        id: 'any_id',
        name: 'Sem porte Pássaro'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(specieWithoutSize)
      jest.spyOn(sizeRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(size)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: specieWithoutSize,
        specieAlias: undefined,
        breed: petResult.anyBreed,
        breedAlias: '',
        size
      })
    })

    test('should return size Sem porte when specie is not cat or dog and specieName is Outros', async () => {
      const { sut, specieRepositoryStub, sizeRepositoryStub } = makeSut()
      const size = {
        id: 'any_id',
        name: 'Sem porte'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(petResult.otherSpecie)
      jest.spyOn(sizeRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(size)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie: petResult.otherSpecie,
        specieAlias: params.specieName,
        breed: petResult.anyBreed,
        breedAlias: '',
        size
      })
    })

    test('should return a size when specie is a cat or dog and size is equal to size in db', async () => {
      const { sut, specieRepositoryStub, sizeRepositoryStub } = makeSut()
      const specie = {
        id: 'any_id',
        name: 'Gato'
      }
      const size = {
        id: 'any_id',
        name: 'Pequeno (Até 10Kg)'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(specie)
      jest.spyOn(sizeRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(size)
      const result = await sut.appoint(params)
      expect(result).toEqual({
        specie,
        specieAlias: undefined,
        breed: petResult.anyBreed,
        breedAlias: '',
        size
      })
    })
  })

  test('should return an AppointPet when success', async () => {
    const { sut } = makeSut()
    const result = await sut.appoint(params)
    expect(result).toEqual({
      specie: petResult.anySpecie,
      specieAlias: undefined,
      breed: petResult.anyBreed,
      breedAlias: '',
      size: petResult.anySize
    })
  })
})
