import { NotAcceptableError } from '@/application/errors'
import { type LoadTagByIdRepository, type UpdateTagRepository } from '@/data/protocols'
import { DbUpdateTag } from '@/data/use-cases'
import { type UpdateTag } from '@/domain/use-cases/scheduler/tag'
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
      guardianId: 'any_guardian_id',
      id: 'any_id',
      name: 'any_name'
    }
    it('Should call loadById with correct value', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const loadTagSpy = jest.spyOn(tagRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadTagSpy).toHaveBeenCalledWith({ guardianId: 'any_guardian_id', tagId: 'any_id' })
    })

    it('Should return NotAcceptableError if incorrect tagId is provided', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const tag = await sut.update({ id: 'invalid_id', name: 'updated_name', guardianId: 'any_guardian_id' })
      expect(tag).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      })
    })

    it('Should throw if loadById throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should call update with correct values', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const updateTagSpy = jest.spyOn(tagRepositoryStub, 'update')
      await sut.update(params)
      expect(updateTagSpy).toHaveBeenCalledWith({
        guardianId: 'any_guardian_id',
        id: 'any_id',
        name: 'any_name'
      })
    })

    it('Should throw if update throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'update').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return a tag data on success', async () => {
      const { sut } = makeSut()
      const result = await sut.update(params)
      expect(result).toEqual({
        isSuccess: true,
        data: {
          id: 'any_id',
          guardianId: 'any_guardian_id',
          name: 'updated_name',
          color: 'any_color'
        }
      })
    })
  })
})
