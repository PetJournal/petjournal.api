import { UpdateTagController } from '@/application/controllers'
import { NotAcceptableError, ServerError } from '@/application/errors'
import { notAcceptable, serverError } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type UpdateTag } from '@/domain/use-cases/scheduler/tag'
import { makeFakeUpdateTagUseCase, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: UpdateTagController
  updateTagStub: UpdateTag
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const updateTagStub = makeFakeUpdateTagUseCase()
  const dependencies: UpdateTagController.Dependencies = {
    updateTag: updateTagStub,
    validation: validationStub
  }
  const sut = new UpdateTagController(dependencies)
  return {
    sut,
    updateTagStub,
    validationStub
  }
}

describe('UpdateTag Contoller', () => {
  const httpRequest = {
    params: 'any_tag_id',
    body: {
      name: 'any_name'
    }
  }
  describe('UpdateTag', () => {
    it('Should return 406(NotAcceptable) if invalid data is provided', async () => {
      const { sut, updateTagStub } = makeSut()
      jest.spyOn(updateTagStub, 'update').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('tagId')))
    })

    it('Should return 500(serverError) if updateTag throws', async () => {
      const { sut, updateTagStub } = makeSut()
      jest.spyOn(updateTagStub, 'update').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError('Internal server Error!')))
    })
  })
})
