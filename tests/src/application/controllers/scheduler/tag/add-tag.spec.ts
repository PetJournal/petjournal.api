import { AddTagController } from '@/application/controllers/scheduler'
import { NotAcceptableError } from '@/application/errors'
import { notAcceptable } from '@/application/helpers'
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
  })
})
