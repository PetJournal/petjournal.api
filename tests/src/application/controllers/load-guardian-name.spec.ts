import { type LoadGuardianName } from '@/domain/use-cases'
import { LoadGuardianNameController } from '@/application/controllers'
import { type HttpRequest, success } from '@/application/helpers'
import { makeFakeLogger, makeFakeServerError, makeLoadGuardianNameUseCase } from '@/tests/utils'
import { type Logger } from '@/data/protocols'

interface SutTypes {
  sut: LoadGuardianNameController
  loadGuardianNameStub: LoadGuardianName
  loggerStub: Logger
}

const makeSut = (): SutTypes => {
  const loadGuardianNameStub = makeLoadGuardianNameUseCase()
  const loggerStub = makeFakeLogger()
  const sut = new LoadGuardianNameController({ loadGuardianName: loadGuardianNameStub, logger: loggerStub })
  return {
    sut,
    loadGuardianNameStub,
    loggerStub
  }
}

describe('LoadGuardianName Controller', () => {
  const httpRequest: HttpRequest = {
    userId: 'any_user_id'
  }

  describe('Logger', () => {
    it('Should call logger.error if LoadGuardianName throws', async () => {
      const { sut, loadGuardianNameStub, loggerStub } = makeSut()
      const loggerSpy = jest.spyOn(loggerStub, 'error')
      const error = new Error('any_error')
      jest.spyOn(loadGuardianNameStub, 'load').mockRejectedValueOnce(error)
      await sut.handle(httpRequest)
      expect(loggerSpy).toHaveBeenCalledWith(error.message, error)
    })
  })

  it('Should call LoadGuardianName with correct values', async () => {
    const { sut, loadGuardianNameStub } = makeSut()
    const getGuardianNameSpy = jest.spyOn(loadGuardianNameStub, 'load')
    await sut.handle(httpRequest)
    expect(getGuardianNameSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should returns 500 (ServerError) if LoadGuardianName throws', async () => {
    const { sut, loadGuardianNameStub } = makeSut()
    jest.spyOn(loadGuardianNameStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return guardian name on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({ firstName: 'any_first_name', lastName: 'any_last_name' }))
  })
})
