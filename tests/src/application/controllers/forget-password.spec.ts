import { type ForgetPassword } from '@/domain/use-cases'
import { type EmailValidator } from '@/application/validation'
import { ForgetPasswordController } from '@/application/controllers'
import { MissingParamError, InvalidParamError, NotFoundError } from '@/application/errors'
import { success, badRequest } from '@/application/helpers'
import {
  type EmailService,
  type TokenGenerator,
  type LoadGuardianByEmailRepository
} from '@/data/protocols'
import {
  makeFakeTokenGenerator,
  makeFakeLoadGuardianByEmailRepository,
  makeEmailValidator,
  makeFakeServerError,
  makeFakeForgetPasswordRequest,
  makeFakeEmailService,
  makeFakeForgetPasswordUseCase
} from '@/tests/utils'

interface SutTypes {
  sut: ForgetPasswordController
  emailValidatorStub: EmailValidator
  loadGuardianByEmailStub: LoadGuardianByEmailRepository
  tokenGeneratorStub: TokenGenerator
  emailServiceStub: EmailService
  forgetPasswordStub: ForgetPassword
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const loadGuardianByEmailStub = makeFakeLoadGuardianByEmailRepository()
  const tokenGeneratorStub = makeFakeTokenGenerator()
  const emailServiceStub = makeFakeEmailService()
  const forgetPasswordStub = makeFakeForgetPasswordUseCase()
  const dependencies: ForgetPasswordController.Dependencies = {
    emailValidator: emailValidatorStub,
    forgetPassword: forgetPasswordStub
  }
  const sut = new ForgetPasswordController(dependencies)
  return {
    sut,
    emailValidatorStub,
    loadGuardianByEmailStub,
    tokenGeneratorStub,
    emailServiceStub,
    forgetPasswordStub
  }
}

describe('ForgetPassword Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeForgetPasswordRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeForgetPasswordRequest())
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return 400 if no guardian is found with the provided email', async () => {
    const { sut, forgetPasswordStub } = makeSut()
    jest.spyOn(forgetPasswordStub, 'forgetPassword').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(makeFakeForgetPasswordRequest())
    expect(httpResponse).toEqual(badRequest(new NotFoundError('email')))
  })

  it('Should return 200 if an valid email is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeForgetPasswordRequest())
    expect(httpResponse).toEqual(success({ message: 'Email sent successfully' }))
  })
})
