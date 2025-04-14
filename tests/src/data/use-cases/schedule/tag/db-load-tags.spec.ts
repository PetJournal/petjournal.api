import { type LoadTagsRepository } from '@/data/protocols'
import { DbLoadTags } from '@/data/use-cases'
import { type LoadTags } from '@/domain/use-cases/schedule/tag'
import { makeFakeTagRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadTags
  tagRepositoryStub: LoadTagsRepository
}

const makeSut = (): SutTypes => {
  const tagRepositoryStub = makeFakeTagRepository()
  const dependencies: LoadTags.Dependencies = {
    tagRepository: tagRepositoryStub
  }
  const sut = new DbLoadTags(dependencies)
  return {
    sut,
    tagRepositoryStub
  }
}

describe('DbLoadTags use case', () => {
  describe('TagRepository', () => {
    it('Should throw if TagRepository throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadAll').mockRejectedValue(new Error())
      const promise = sut.loadAll()
      await expect(promise).rejects.toThrow()
    })
  })
})
