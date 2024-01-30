import { type LoadCatSizesRepository } from '@/data/protocols/db/size/load-cat-sizes-repository'
import { DbLoadCatSizes } from '@/data/use-cases/pet/size'
import { type LoadCatSizes } from '@/domain/use-cases/pet/size/load-cat-sizes'
import { makeFakeLoadCatSizesRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadCatSizes
  sizeRepositoryStub: LoadCatSizesRepository
}

const makeSut = (): SutTypes => {
  const sizeRepositoryStub = makeFakeLoadCatSizesRepository()
  const dependencies: LoadCatSizes.Dependencies = {
    sizeRepository: sizeRepositoryStub
  }
  const sut = new DbLoadCatSizes(dependencies)
  return {
    sut,
    sizeRepositoryStub
  }
}

describe('DbLoadCatSizesRepository', () => {
  describe('SizeRepository', () => {
    it('Should throw if sizeRepository throws', async () => {
      const { sut, sizeRepositoryStub } = makeSut()
      jest.spyOn(sizeRepositoryStub, 'loadCatSizes').mockRejectedValueOnce(new Error())
      const promise = sut.load()
      await expect(promise).rejects.toThrow()
    })

    it('Should return a list of sizes on success', async () => {
      const { sut } = makeSut()
      const result = await sut.load()
      expect(result).toEqual([{ name: 'any_name' }])
    })

    it('Should return undefined if sizeRepository returns undefined', async () => {
      const { sut, sizeRepositoryStub } = makeSut()
      jest.spyOn(sizeRepositoryStub, 'loadCatSizes').mockResolvedValueOnce(undefined)
      const result = await sut.load()
      expect(result).toBe(undefined)
    })
  })
})
