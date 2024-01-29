import { type LoadDogBreedsRepository } from '@/data/protocols'
import { DbLoadDogBreeds } from '@/data/use-cases/pet/breed/db-load-dog-breeds'
import { type LoadDogBreeds } from '@/domain/use-cases'
import { makeFakeLoadDogBreedRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadDogBreeds
  breedRepositoryStub: LoadDogBreedsRepository
}

const makeSut = (): SutTypes => {
  const breedRepositoryStub = makeFakeLoadDogBreedRepository()
  const dependencies: LoadDogBreeds.Dependencies = {
    breedRepository: breedRepositoryStub
  }
  const sut = new DbLoadDogBreeds(dependencies)
  return {
    sut,
    breedRepositoryStub
  }
}

describe('DbLoadDogBreeds', () => {
  describe('BreedRepository', () => {
    it('Should throw if breedResitory throws', async () => {
      const { sut, breedRepositoryStub } = makeSut()
      jest.spyOn(breedRepositoryStub, 'loadDogBreeds').mockRejectedValueOnce(new Error())
      const promise = sut.load()
      await expect(promise).rejects.toThrow()
    })

    it('Should return a list of breeds on success', async () => {
      const { sut } = makeSut()
      const result = await sut.load()
      expect(result).toEqual([{ name: 'any_name' }])
    })

    it('Should return undefined if breedRepository returns undefined', async () => {
      const { sut, breedRepositoryStub } = makeSut()
      jest.spyOn(breedRepositoryStub, 'loadDogBreeds').mockResolvedValueOnce(undefined)
      const result = await sut.load()
      expect(result).toBe(undefined)
    })
  })
})
