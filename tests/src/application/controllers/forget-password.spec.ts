import { type ForgetPassword } from '@/domain/use-cases'
import { type Validation } from '@/application/protocols'
import { ForgetPasswordController } from '@/application/controllers'
import { MissingParamError, NotFoundError } from '@/application/errors'
import { badRequest, success } from '@/application/helpers'
import {
  makeFakeForgetPasswordRequest,
  makeFakeForgetPasswordUseCase,
  makeFakeServerError,
  makeFakeValidation
} from '@/tests/utils'

interface SutTypes {
  sut: ForgetPasswordController
  forgetPasswordStub: ForgetPassword
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const forgetPasswordStub = makeFakeForgetPasswordUseCase()
  const dependencies: ForgetPasswordController.Dependencies = {
    forgetPassword: forgetPasswordStub,
    validation: validationStub
  }
  const sut = new ForgetPasswordController(dependencies)
  return {
    sut,
    forgetPasswordStub,
    validationStub
  }
}

describe('ForgetPassword Controller', () => {
  const httpRequest = makeFakeForgetPasswordRequest()
  describe('ForgetPassword Use case', () => {
    it('Should return 400 (BadRequest) if invalid email is provide', async () => {
      const { sut, forgetPasswordStub } = makeSut()
      jest.spyOn(forgetPasswordStub, 'forgetPassword').mockResolvedValue(false)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new NotFoundError('email')))
    })

    it('Should return 500 (ServerError) if ForgetPassword use case throws', async () => {
      const { sut, forgetPasswordStub } = makeSut()
      jest.spyOn(forgetPasswordStub, 'forgetPassword').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call ForgetPassword with correct values', async () => {
      const { sut, forgetPasswordStub } = makeSut()
      const forgetPasswordSpy = jest.spyOn(forgetPasswordStub, 'forgetPassword')
      await sut.handle(httpRequest)
      expect(forgetPasswordSpy).toHaveBeenCalledWith({ email: httpRequest.body.email })
    })
  })

  describe('Validation', () => {
    it('Should return 400 (BadRequest) if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('email'))
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('Should call Validation with correct value', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email
      })
    })
  })

  test('Should return 200 (Success) if valid email is provide', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({ message: 'Email sent successfully' }))
  })
})
