import { UpdateTagController } from '@/application/controllers'
import { NotAcceptableError, ServerError } from '@/application/errors'
import { badRequest, notAcceptable, serverError, success } from '@/application/helpers'
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
    params: { tagId: 'any_tag_id' },
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

    it('Should call updateTag with correct values', async () => {
      const { sut, updateTagStub } = makeSut()
      const updateTagSpy = jest.spyOn(updateTagStub, 'update')
      await sut.handle(httpRequest)
      expect(updateTagSpy).toHaveBeenCalledWith({ id: 'any_tag_id', name: 'any_name' })
    })
  })

  describe('Validation', () => {
    it('Should return 404(badRequest) if validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
      const result = await sut.handle(httpRequest)
      expect(result).toEqual(badRequest(new Error()))
    })
  })

  it('Should return 200(success) if updateTag success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      isSuccess: true,
      data: {
        id: 'any_id',
        name: 'any_name',
        color: 'any_color'
      }
    }))
  })
})
