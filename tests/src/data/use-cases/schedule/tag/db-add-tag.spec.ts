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
    name: 'any_name',
    color: 'any_color'
  }
  describe('TagRepository', () => {
    it('Should call add method with correct values', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const addTagSpy = jest.spyOn(tagRepositoryStub, 'add')
      await sut.add(params)
      expect(addTagSpy).toHaveBeenCalledWith({
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

    it('Should return a tag data when saving tag successfully', async () => {
      const { sut } = makeSut()
      const result = await sut.add(params)
      expect(result).toEqual({
        id: 'any_id',
        name: 'any_name',
        color: 'any_color'
      })
    })
  })
})
