import { UpdateGuardianController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { notAcceptable } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type UpdateGuardian } from '@/domain/use-cases'
import { makeFakeServerError, makeFakeUpdateGuardianRequest, makeFakeUpdateGuardianUseCase, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: UpdateGuardianController
  updateGuardianStub: UpdateGuardian
  validationStub: Validation

}

const makeSut = (): SutTypes => {
  const updateGuardianStub = makeFakeUpdateGuardianUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: UpdateGuardianController.Dependencies = {
    updateGuardian: updateGuardianStub,
    validation: validationStub
  }
  const sut = new UpdateGuardianController(dependencies)
  return {
    sut,
    updateGuardianStub,
    validationStub
  }
}

describe('UpdateGuardian Controller', () => {
  const httpRequest = makeFakeUpdateGuardianRequest()

  describe('UpdateGuardian', () => {
    it('Should return 406 (NotAcceptable) if invalid data is provided', async () => {
      const { sut, updateGuardianStub } = makeSut()
      jest.spyOn(updateGuardianStub, 'update').mockResolvedValue({
        isSuccess: false,
        error: new InvalidParamError('any_field')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new InvalidParamError('any_field')))
    })

    it('Should return 500 (ServerError) if update throws', async () => {
      const { sut, updateGuardianStub } = makeSut()
      jest.spyOn(updateGuardianStub, 'update').mockRejectedValue(new Error())
      const promise = await sut.handle(httpRequest)
      expect(promise).toEqual(makeFakeServerError())
    })
  })

  describe('Validations', () => {

  })
})
