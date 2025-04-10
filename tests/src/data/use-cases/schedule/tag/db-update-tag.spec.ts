import { type LoadTagByIdRepository, type UpdateTagRepository } from '@/data/protocols'
import { DbUpdateTag } from '@/data/use-cases'
import { type UpdateTag } from '@/domain/use-cases/schedule/tag'
import { makeFakeTagRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbUpdateTag
  tagRepositoryStub: LoadTagByIdRepository & UpdateTagRepository
}

const makeSut = (): SutTypes => {
  const tagRepositoryStub = makeFakeTagRepository()
  const dependencies: UpdateTag.Dependencies = {
    tagRepository: tagRepositoryStub
  }
  const sut = new DbUpdateTag(dependencies)
  return {
    sut,
    tagRepositoryStub
  }
}

describe('DbUpdateTag use case', () => {
  describe('TagRepository', () => {
    const params: UpdateTag.Params = {
      id: 'any_id',
      name: 'any_name'
    }
    it('Should call loadById with correct value', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const loadTagSpy = jest.spyOn(tagRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadTagSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
