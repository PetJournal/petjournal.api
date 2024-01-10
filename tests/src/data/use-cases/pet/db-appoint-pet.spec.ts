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
  })
})
