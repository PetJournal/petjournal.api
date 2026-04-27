import { NotAcceptableError } from '@/application/errors'
import { type LoadTagByIdRepository } from '@/data/protocols'
import { DbLoadTagById } from '@/data/use-cases/scheduler/tag/db-load-tag-by-id'
import { type LoadTagById } from '@/domain/use-cases/scheduler/tag'
import { makeFakeTagRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadTagById
  tagRepositoryStub: LoadTagByIdRepository
}

const makeSut = (): SutTypes => {
  const tagRepositoryStub = makeFakeTagRepository()
  const dependencies: LoadTagById.Dependencies = {
    tagRepository: tagRepositoryStub
  }
  const sut = new DbLoadTagById(dependencies)
  return {
    sut,
    tagRepositoryStub
  }
}

describe('DbLoadTagById use case', () => {
  const param: LoadTagByIdRepository.Param = {
    tagId: 'any_id',
    guardianId: 'any_guardian_id'
  }

  describe('TagRepository', () => {
    it('Should call loadById method with correct value', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const loadTagSpy = jest.spyOn(tagRepositoryStub, 'loadById')
      await sut.loadById(param)
      expect(loadTagSpy).toHaveBeenCalledWith({
        tagId: 'any_id',
        guardianId: 'any_guardian_id'
      })
    })

    it('Should return NotAcceptableError if invalid tagId is provided', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const tag = await sut.loadById(param)
      expect(tag).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      })
    })

    it('Should throw if tagRepository throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.loadById(param)
      await expect(promise).rejects.toThrow()
    })

    it('Should return a tag on success', async () => {
      const { sut } = makeSut()
      const tag = await sut.loadById(param)
      expect(tag).toEqual({
        isSuccess: true,
        data: {
          id: 'any_id',
          guardianId: 'any_guardian_id',
          name: 'any_name',
          color: 'any_color'

        }
      })
    })
  })
})
