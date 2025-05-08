import { DeleteTagByIdController } from '@/application/controllers'
import { NotFoundError, ServerError } from '@/application/errors'
import { notAcceptable, serverError, success } from '@/application/helpers'
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

    it('Should call deleteTag with correct value', async () => {
      const { sut, deleteTagStub } = makeSut()
      const deleteTagSpy = jest.spyOn(deleteTagStub, 'deleteById')
      await sut.handle(httpRequest)
      expect(deleteTagSpy).toHaveBeenCalledWith('any_id')
    })

    it('Should return 500(serverError) if deleteTag throws', async () => {
      const { sut, deleteTagStub } = makeSut()
      jest.spyOn(deleteTagStub, 'deleteById').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError('Internal server error!')))
    })

    it('Should return 200 (success) if tag was deleted', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(success({
        message: 'Tag deleted',
        tagId: 'any_id'
      }))
    })
  })
})
