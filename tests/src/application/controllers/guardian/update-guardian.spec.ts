import { UpdateGuardianController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { badRequest, notAcceptable } from '@/application/helpers'
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

    it('Should call update with correct values', async () => {
      const { sut, updateGuardianStub } = makeSut()
      const updateSpy = jest.spyOn(updateGuardianStub, 'update')
      await sut.handle(httpRequest)
      expect(updateSpy).toHaveBeenCalledWith({
        guardianId: httpRequest.params.guardianId,
        firstName: httpRequest.body.firstName,
        lastName: httpRequest.body.lastName,
        phone: httpRequest.body.phone,
        image: httpRequest.file
      })
    })
  })

  describe('Validations', () => {
    it('Should return 400 (BadRequest) if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new Error()))
    })

    it('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')

      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith({ ...httpRequest.body, ...httpRequest.params })
    })
  })
})
