import { type Controller } from '@/application/protocols'
import { type HttpRequest, type HttpResponse, serverError, success } from '@/application/helpers'
import { type LoggerErrorRepository } from '@/data/protocols'
import { LoggerControllerDecorator } from '@/main/decorators'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: true
      }
      return await Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}

const makeLoggerErrorRepository = (): LoggerErrorRepository => {
  class LoggerErrorRepositoryStub implements LoggerErrorRepository {
    async logError (stack: string): Promise<void> {
      await Promise.resolve(null)
    }
  }
  return new LoggerErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    phone: 'any_phone',
    password: 'any_password',
    passwordConfirmation: 'any_password',
    isPrivacyPolicyAccepted: true
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface SutTypes {
  controllerStub: Controller
  loggerErrorRepositoryStub: LoggerErrorRepository
  sut: LoggerControllerDecorator
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const loggerErrorRepositoryStub = makeLoggerErrorRepository()
  const sut = new LoggerControllerDecorator(controllerStub, loggerErrorRepositoryStub)
  return { controllerStub, loggerErrorRepositoryStub, sut }
}

describe('LoggerController Decorator', () => {
  it('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenLastCalledWith(makeFakeRequest())
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(success(true))
  })

  it('Should call LoggerErrorRepository with correct error if controller retuns a server error', async () => {
    const { controllerStub, loggerErrorRepositoryStub, sut } = makeSut()
    const loggerSpy = jest.spyOn(loggerErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    await sut.handle(makeFakeRequest())
    expect(loggerSpy).toHaveBeenCalledWith('any_stack')
  })
})
