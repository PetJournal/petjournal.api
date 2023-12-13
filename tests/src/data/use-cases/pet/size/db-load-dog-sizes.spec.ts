import { type LoadDogSizesRepository } from '@/data/protocols/db/size/load-dog-sizes-repository'
import { DbLoadDogSizesRepository } from '@/data/use-cases/pet/size/db-load-dog-sizes-repository'
import { type LoadDogSizes } from '@/domain/use-cases/pet/size/load-dog-sizes'
import { makeFakeLoadDogSizesRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadDogSizesRepository
  sizeRepositoryStub: LoadDogSizesRepository
}

const makeSut = (): SutTypes => {
  const sizeRepositoryStub = makeFakeLoadDogSizesRepository()
  const dependencies: LoadDogSizes.Dependencies = {
    sizeRepository: sizeRepositoryStub
  }
  const sut = new DbLoadDogSizesRepository(dependencies)
  return {
    sut,
    sizeRepositoryStub
  }
}

describe('DbLoadDogSizesRepository', () => {
  describe('SizeRepository', () => {
    test('should throw if sizeRepository throws', async () => {
      const { sut, sizeRepositoryStub } = makeSut()
      jest.spyOn(sizeRepositoryStub, 'loadDogSizes').mockRejectedValueOnce(new Error())
      const promise = sut.load()
      await expect(promise).rejects.toThrow()
    })

    test('should return a list of sizes on success', async () => {
      const { sut } = makeSut()
      const result = await sut.load()
      expect(result).toEqual([{ name: 'any_name' }])
    })
  })
})
