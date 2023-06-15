import { type Validation } from '@/application/protocols'
import { type ChangePassword } from '@/domain/use-cases'
import { ChangePasswordController } from '@/application/controllers'
import { badRequest, success } from '@/application/helpers'
import { MissingParamError, NotFoundError } from '@/application/errors'
import {
  makeFakeChangePasswordRequest,
  makeFakeChangePasswordUseCase,
  makeFakeServerError,
  makeFakeValidation
} from '@/tests/utils'

interface SutTypes {
  sut: ChangePasswordController
  changePasswordStub: ChangePassword
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const changePasswordStub = makeFakeChangePasswordUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: ChangePasswordController.Dependencies = {
    changePassword: changePasswordStub,
    validation: validationStub
  }
  const sut = new ChangePasswordController(dependencies)
  return {
    sut,
    changePasswordStub,
    validationStub
  }
}

describe('ChangePasswordController', () => {
  const httpRequest = makeFakeChangePasswordRequest()
  describe('ChangePassword Use case', () => {
    it('Should return 400 (BadRequest) if invalid userId is provide', async () => {
      const { sut, changePasswordStub } = makeSut()
      jest.spyOn(changePasswordStub, 'change').mockResolvedValue({
        isSuccess: false,
        error: new NotFoundError('userId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new NotFoundError('userId')))
    })

    it('Should return 500 (ServerError) if ChangePassword use case throws', async () => {
      const { sut, changePasswordStub } = makeSut()
      jest.spyOn(changePasswordStub, 'change').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call ForgetPassword with correct values', async () => {
      const { sut, changePasswordStub } = makeSut()
      const changePasswordSpy = jest.spyOn(changePasswordStub, 'change')
      await sut.handle(httpRequest)
      expect(changePasswordSpy).toHaveBeenCalledWith({
        id: httpRequest.userId,
        password: httpRequest.body.password
      })
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
        userId: httpRequest.userId,
        ...httpRequest.body
      })
    })
  })

  test('Should return 200 (Success) if valid user data are provide', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({ message: 'Password reset completed successfully' }))
  })
})
