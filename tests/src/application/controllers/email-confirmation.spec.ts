import { EmailConfirmationController } from '@/application/controllers'
import { NotFoundError } from '@/application/errors'
import { badRequest, success } from '@/application/helpers'
import { type EmailConfirmation } from '@/domain/use-cases'
import { makeFakeEmailConfirmationRequest, makeFakeEmailConfirmationUseCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: EmailConfirmationController
  emailConfirmationStub: EmailConfirmation
}

const makeSut = (): SutTypes => {
  const emailConfirmationStub = makeFakeEmailConfirmationUseCase()
  const sut = new EmailConfirmationController({ emailConfirmation: emailConfirmationStub })
  return {
    sut,
    emailConfirmationStub
  }
}
describe('EmailConfirmation Controller', () => {
  const httpRequest = makeFakeEmailConfirmationRequest()
  it('Should call emailConfirmation with correct value', async () => {
    const { sut, emailConfirmationStub } = makeSut()
    const confirmSpy = jest.spyOn(emailConfirmationStub, 'confirm')
    await sut.handle(httpRequest)
    expect(confirmSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return 400 (BadRequest) if invalid userId is provided', async () => {
    const { sut, emailConfirmationStub } = makeSut()
    jest.spyOn(emailConfirmationStub, 'confirm').mockResolvedValueOnce({
      isSuccess: false,
      error: new NotFoundError('guardian')
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NotFoundError('guardian')))
  })

  it('Should return 500 (ServerError) if EmailConfirmation throws', async () => {
    const { sut, emailConfirmationStub } = makeSut()
    jest.spyOn(emailConfirmationStub, 'confirm').mockRejectedValue(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return 200 (success) if EmailConfirmation update on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      message: 'email confirmed',
      userId: 'any_id',
      email: 'any_email@mail.com'
    }))
  })
})
