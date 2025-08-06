import { LoadSettingsController } from '@/application/controllers'
import { NotAcceptableError } from '@/application/errors'
import { serverError, success } from '@/application/helpers'
import { type LoadSettings } from '@/domain/use-cases/settings'
import { makeFakeLoadSettingsUseCase } from '@/tests/utils'

interface SutTypes {
  sut: LoadSettingsController
  loadSettingsStub: LoadSettings
}

const makeSut = (): SutTypes => {
  const loadSettingsStub = makeFakeLoadSettingsUseCase()
  const dependencies: LoadSettingsController.Dependencies = {
    loadSettings: loadSettingsStub
  }
  const sut = new LoadSettingsController(dependencies)
  return {
    sut,
    loadSettingsStub
  }
}

describe('LoadSettings Controller', () => {
  describe('LoadSettings use case', () => {
    it('Should return 500(serverError) if loadSettings throws', async () => {
      const { sut, loadSettingsStub } = makeSut()
      jest.spyOn(loadSettingsStub, 'loadAll').mockRejectedValue(new Error())
      const httpResponse = await sut.handle({})
      expect(httpResponse).toEqual(serverError(new NotAcceptableError('Internal server error!')))
    })

    it('Should return an list of settings on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({})
      expect(httpResponse).toEqual(success([{
        notification_email: true,
        notification_mobile: true
      }]))
    })
  })
})
