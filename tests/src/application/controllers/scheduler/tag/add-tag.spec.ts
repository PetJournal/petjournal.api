import { AddTagController } from '@/application/controllers/scheduler'
import { NotAcceptableError, ServerError } from '@/application/errors'
import { badRequest, notAcceptable, serverError } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type AddTag } from '@/domain/use-cases'
import { makeFakeAddTagRequest, makeFakeAddTagUseCase, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: AddTagController
  addTagStub: AddTag
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const addTagStub = makeFakeAddTagUseCase()
  const dependencies: AddTagController.Dependencies = {
    addTag: addTagStub,
    validation: validationStub
  }
  const sut = new AddTagController(dependencies)
  return {
    sut,
    addTagStub,
    validationStub
  }
}

describe('AddTag Controller', () => {
  const httpRequest = makeFakeAddTagRequest()
  describe('AddTag', () => {
    it('Should return 406(Not Acceptable) if invalid data is provided', async () => {
      const { sut, addTagStub } = makeSut()
      jest.spyOn(addTagStub, 'add').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('Internal Server Error!')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('Internal Server Error!')))
    })

    it('Should return 500(Server Error) if AddTag throws', async () => {
      const { sut, addTagStub } = makeSut()
      jest.spyOn(addTagStub, 'add').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError('Internal server error')))
    })

    it('Should call AddTag with correct values', async () => {
      const { sut, addTagStub } = makeSut()
      const addTagSpy = jest.spyOn(addTagStub, 'add')
      await sut.handle(httpRequest)
      expect(addTagSpy).toHaveBeenCalledWith({
        name: httpRequest.body.name,
        color: httpRequest.body.color
      })
    })
  })

  describe('Validations', () => {
    it('Should return 400 (BadRequest) if validation returns error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new Error()))
    })

    it('Should call validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validationSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(httpRequest)
      expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
    })
  })
})
