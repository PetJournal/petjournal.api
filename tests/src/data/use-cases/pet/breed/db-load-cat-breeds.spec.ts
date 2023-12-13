import { type LoadCatBreedsRepository } from '@/data/protocols'
import { DbLoadCatBreeds } from '@/data/use-cases/pet/breed'
import { type LoadCatBreeds } from '@/domain/use-cases'
import { makeFakeLoadCatBreedRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadCatBreeds
  breedRepositoryStub: LoadCatBreedsRepository
}

const makeSut = (): SutTypes => {
  const breedRepositoryStub = makeFakeLoadCatBreedRepository()
  const dependencies: LoadCatBreeds.Dependencies = {
    breedRepository: breedRepositoryStub
  }
  const sut = new DbLoadCatBreeds(dependencies)
  return {
    sut,
    breedRepositoryStub
  }
}

describe('DbLoadCatBreeds', () => {
  describe('BreedRepository', () => {
    test('should throw if breedRepository throws', async () => {
      const { sut, breedRepositoryStub } = makeSut()
      jest.spyOn(breedRepositoryStub, 'loadCatBreeds').mockRejectedValueOnce(new Error())
      const promise = sut.load()
      await expect(promise).rejects.toThrow()
    })
  })
})
