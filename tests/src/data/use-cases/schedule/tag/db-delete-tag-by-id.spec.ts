import { NotFoundError } from '@/application/errors'
import { type DeleteTagRepository } from '@/data/protocols'
import { DbDeleteTagById } from '@/data/use-cases'
import { type DeleteTagById } from '@/domain/use-cases/scheduler/tag'
import { makeFakeTagRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbDeleteTagById
  tagRepositoryStub: DeleteTagRepository
}

const makeSut = (): SutTypes => {
  const tagRepositoryStub = makeFakeTagRepository()
  const dependencies: DeleteTagById.Dependencies = {
    tagRepository: tagRepositoryStub
  }
  const sut = new DbDeleteTagById(dependencies)
  return {
    sut,
    tagRepositoryStub
  }
}

describe('DbDeleteTagById use case', () => {
  describe('TagRepository', () => {
    it('Should return NotFoundError if invalid tag id is provided', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'deleteById').mockResolvedValueOnce(false)
      const result = await sut.deleteById('invalid_id')
      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('tagId')
      })
    })

    it('Should return true on success', async () => {
      const { sut } = makeSut()
      const result = await sut.deleteById('any_id')
      expect(result).toEqual({
        isSuccess: true
      })
    })
  })
})
