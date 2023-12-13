import { type LoadCatSizesRepository } from '@/data/protocols/db/size/load-cat-sizes-repository'
import { DbLoadCatSizesRepository } from '@/data/use-cases/pet/size/db-load-cat-sizes-repository'
import { type LoadCatSizes } from '@/domain/use-cases/pet/size/load-cat-sizes'
import { makeFakeLoadCatSizesRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadCatSizesRepository
  sizeRepositoryStub: LoadCatSizesRepository
}

const makeSut = (): SutTypes => {
  const sizeRepositoryStub = makeFakeLoadCatSizesRepository()
  const dependencies: LoadCatSizes.Dependencies = {
    sizeRepository: sizeRepositoryStub
  }
  const sut = new DbLoadCatSizesRepository(dependencies)
  return {
    sut,
    sizeRepositoryStub
  }
}

describe('DbLoadCatSizesRepository', () => {
  describe('SizeRepository', () => {
    test('Should throw if sizeRepository throws', async () => {
      const { sut, sizeRepositoryStub } = makeSut()
      jest.spyOn(sizeRepositoryStub, 'loadCatSizes').mockRejectedValueOnce(new Error())
      const promise = sut.load()
      await expect(promise).rejects.toThrow()
    })
  })
})
