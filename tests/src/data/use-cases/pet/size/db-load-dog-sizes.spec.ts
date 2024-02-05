import { type LoadDogSizesRepository } from '@/data/protocols/db/size/load-dog-sizes-repository'
import { DbLoadDogSizes } from '@/data/use-cases/pet/size'
import { type LoadDogSizes } from '@/domain/use-cases/pet/size/load-dog-sizes'
import { makeFakeLoadDogSizesRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadDogSizes
  sizeRepositoryStub: LoadDogSizesRepository
}

const makeSut = (): SutTypes => {
  const sizeRepositoryStub = makeFakeLoadDogSizesRepository()
  const dependencies: LoadDogSizes.Dependencies = {
    sizeRepository: sizeRepositoryStub
  }
  const sut = new DbLoadDogSizes(dependencies)
  return {
    sut,
    sizeRepositoryStub
  }
}

describe('DbLoadDogSizesRepository', () => {
  describe('SizeRepository', () => {
    it('should throw if sizeRepository throws', async () => {
      const { sut, sizeRepositoryStub } = makeSut()
      jest.spyOn(sizeRepositoryStub, 'loadDogSizes').mockRejectedValueOnce(new Error())
      const promise = sut.load()
      await expect(promise).rejects.toThrow()
    })

    it('should return a list of sizes on success', async () => {
      const { sut } = makeSut()
      const result = await sut.load()
      expect(result).toEqual([{ name: 'any_name' }])
    })
  })
})
