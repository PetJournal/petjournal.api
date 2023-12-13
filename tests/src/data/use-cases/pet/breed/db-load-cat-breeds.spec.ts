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

    test('should return a list of breeds on success', async () => {
      const { sut } = makeSut()
      const result = await sut.load()
      expect(result).toEqual([{ name: 'any_name' }])
    })
  })
})
