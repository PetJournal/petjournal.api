import { DeleteTagByIdController } from '@/application/controllers'
import { NotFoundError } from '@/application/errors'
import { notAcceptable } from '@/application/helpers'
import { type DeleteTagById } from '@/domain/use-cases/scheduler/tag'
import { makeFakeDeleteTagByIdUseCase } from '@/tests/utils'

interface SutTypes {
  sut: DeleteTagByIdController
  deleteTagStub: DeleteTagById
}

const makeSut = (): SutTypes => {
  const deleteTagStub = makeFakeDeleteTagByIdUseCase()
  const dependencies: DeleteTagByIdController.Dependencies = {
    deleteTag: deleteTagStub
  }
  const sut = new DeleteTagByIdController(dependencies)
  return {
    sut,
    deleteTagStub
  }
}

describe('DeleteTagById Controller', () => {
  const httpRequest = {
    body: {
      tagId: 'any_id'
    }
  }
  describe('DeleteTagById', () => {
    it('Should return 406(NotAcceptable) if a invalid tagId is provided', async () => {
      const { sut, deleteTagStub } = makeSut()
      jest.spyOn(deleteTagStub, 'deleteById').mockResolvedValue({
        isSuccess: false,
        error: new NotFoundError('tagId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotFoundError('tagId')))
    })
  })
})
