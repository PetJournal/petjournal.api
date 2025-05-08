import { LoadTagsController } from '@/application/controllers'
import { NotAcceptableError } from '@/application/errors'
import { serverError, success } from '@/application/helpers'
import { type LoadTags } from '@/domain/use-cases/scheduler/tag'
import { makeFakeLoadTagsUseCase } from '@/tests/utils'

interface SutTypes {
  sut: LoadTagsController
  loadTagsStub: LoadTags
}

const makeSut = (): SutTypes => {
  const loadTagsStub = makeFakeLoadTagsUseCase()
  const dependencies: LoadTagsController.Dependencies = {
    loadTags: loadTagsStub
  }
  const sut = new LoadTagsController(dependencies)
  return {
    sut,
    loadTagsStub
  }
}

describe('LoadTags Controller', () => {
  describe('LoadTags use case', () => {
    it('Should return 500(serverError) if loadTags throws', async () => {
      const { sut, loadTagsStub } = makeSut()
      jest.spyOn(loadTagsStub, 'loadAll').mockRejectedValue(new Error())
      const httpResponse = await sut.handle({})
      expect(httpResponse).toEqual(serverError(new NotAcceptableError('Internal server error!')))
    })

    it('Should return an empty array if there are not tags registered', async () => {
      const { sut, loadTagsStub } = makeSut()
      jest.spyOn(loadTagsStub, 'loadAll').mockResolvedValueOnce([])
      const httpResponse = await sut.handle({})
      expect(httpResponse).toEqual(success([]))
    })

    it('Should return an list of tags on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({})
      expect(httpResponse).toEqual(success([{
        id: 'any_id',
        name: 'any_name',
        color: 'any_color'
      }]))
    })
  })
})
