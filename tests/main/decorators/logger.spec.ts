import { type Controller } from '@/application/controllers/controller'
import { type HttpRequest, type HttpResponse } from '@/application/helpers/http'
import { LoggerControllerDecorator } from '@/main/decorators/logger'
import { serverError } from '@/application/helpers/http'
import { type LoggerErrorRepository } from '@/data/protocols/logger-error-repository'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: true
      }
      return await new Promise(resolve => { resolve(httpResponse) })
    }
  }
  return new ControllerStub()
}

const makeLoggerErrorRepository = (): LoggerErrorRepository => {
  class LoggerErrorRepositoryStub implements LoggerErrorRepository {
    async log (stack: string): Promise<void> {
      await new Promise(resolve => { resolve(null) })
    }
  }
  return new LoggerErrorRepositoryStub()
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
    const httpRequest = {
      body: {
        firstname: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenLastCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstname: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: true
    })
  })

  it('Should call LoggerErrorRepository with correct error if controller retuns a server error', async () => {
    const { controllerStub, loggerErrorRepositoryStub, sut } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const loggerSpy = jest.spyOn(loggerErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(error) }))
    const httpRequest = {
      body: {
        firstname: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    await sut.handle(httpRequest)
    expect(loggerSpy).toHaveBeenCalledWith('any_stack')
  })
})
