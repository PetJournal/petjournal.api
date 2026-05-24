import { ServerError } from '@/application/errors'
import { type AddTagRepository } from '@/data/protocols'
import { DbAddTag } from '@/data/use-cases'
import { type AddTag } from '@/domain/use-cases/scheduler/tag/add-tag'
import { makeFakeTagRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbAddTag
  tagRepositoryStub: AddTagRepository
}

const makeSut = (): SutTypes => {
  const tagRepositoryStub = makeFakeTagRepository()
  const dependencies: AddTag.Dependencies = {
    tagRepository: tagRepositoryStub
  }
  const sut = new DbAddTag(dependencies)
  return {
    sut,
    tagRepositoryStub
  }
}

describe('DbAddTag use case', () => {
  const params: AddTag.Params = {
    guardianId: 'any_guardian_id',
    name: 'any_name',
    color: 'any_color'
  }
  describe('TagRepository', () => {
    it('Should call add method with correct values', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const addTagSpy = jest.spyOn(tagRepositoryStub, 'add')
      await sut.add(params)
      expect(addTagSpy).toHaveBeenCalledWith({
        guardianId: 'any_guardian_id',
        name: 'any_name',
        color: 'any_color'
      })
    })

    it('Should throw if add method throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'add').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return undefined if invalid data is provided', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'add').mockResolvedValueOnce(undefined)
      const result = await sut.add(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return a tag data when saving tag successfully', async () => {
      const { sut } = makeSut()
      const result = await sut.add(params)
      expect(result).toEqual({
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
