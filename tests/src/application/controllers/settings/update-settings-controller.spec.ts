import { UpdateSettingsController } from '@/application/controllers'
import { badRequest, success, type HttpRequest } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type UpdateSettings } from '@/domain/use-cases'
import { makeFakeUpdateSettingsUseCase, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: UpdateSettingsController
  updateSettingsStub: UpdateSettings
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const updateSettingsStub = makeFakeUpdateSettingsUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: UpdateSettingsController.Dependencies = {
    updateSettings: updateSettingsStub,
    validation: validationStub
  }
  const sut = new UpdateSettingsController(dependencies)
  return {
    sut,
    updateSettingsStub,
    validationStub
  }
}
describe('UpdateSettings Controller', () => {
  const httpRequest: HttpRequest = {
    body: {
      notificationEmail: false,
      notificationMobile: false
    }
  }
  describe('Validation', () => {
    it('Should return 400(badRequest) if validations returns error', async () => {
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

  it('Should return updated settings on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      guardianId: 'any_id',
      notificationEmail: false,
      notificationMobile: false
    }))
  })
})
