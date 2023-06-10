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
  const forgetPasswordStub = makeFakeForgetPasswordUseCase()
  const validationStub = makeFakeValidation()
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
  describe('ForgetPassword Use case', () => {
    it('Should call ForgetPassword with correct values', async () => {
      const { sut, forgetPasswordStub } = makeSut()
      const httpRequest = makeFakeForgetPasswordRequest()
      const forgetPasswordSpy = jest.spyOn(forgetPasswordStub, 'forgetPassword')
      await sut.handle(httpRequest)
      expect(forgetPasswordSpy).toHaveBeenCalledWith({ email: httpRequest.body.email })
    })

    it('Should return 500 if ForgetPassword use case throws', async () => {
      const { sut, forgetPasswordStub } = makeSut()
      const httpRequest = makeFakeForgetPasswordRequest()
      jest.spyOn(forgetPasswordStub, 'forgetPassword').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 400 if invalid email is provide', async () => {
      const { sut, forgetPasswordStub } = makeSut()
      const httpRequest = makeFakeForgetPasswordRequest()
      jest.spyOn(forgetPasswordStub, 'forgetPassword').mockResolvedValue(false)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new NotFoundError('email')))
    })

    it('Should return 200 if valid email is provide', async () => {
      const { sut } = makeSut()
      const httpRequest = makeFakeForgetPasswordRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(success({ message: 'Email sent successfully' }))
    })
  })

  describe('Validation', () => {
    it('Should call Validation with correct value', async () => {
      const { sut, validationStub } = makeSut()
      const httpRequest = makeFakeForgetPasswordRequest()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email
      })
    })

    it('Should return 400 if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      const httpRequest = makeFakeForgetPasswordRequest()
      jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('email'))
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
  })
})
