import { type Controller } from '@/application/controllers/controller'
import { type HttpRequest, type HttpResponse } from '@/application/helpers/http'
import { LoggerControllerDecorator } from '@/main/decorators/logger'

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
interface SutTypes {
  controllerStub: Controller
  sut: LoggerControllerDecorator
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LoggerControllerDecorator(controllerStub)
  return { controllerStub, sut }
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
})
