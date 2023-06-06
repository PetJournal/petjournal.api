import { type ChangePassword } from '@/domain/use-cases'
import { type PasswordValidator } from '@/application/validation'
import { ChangePasswordController } from '@/application/controllers'
import { badRequest, success } from '@/application/helpers'
import {
  PasswordRequirementsError,
  PasswordMismatchError,
  MissingParamError,
  NotFoundError
} from '@/application/errors'
import {
  makeFakeChangePasswordRequest,
  makeFakeChangePasswordUseCase,
  makePasswordValidator,
  makeFakeServerError
} from '@/tests/utils'

interface SutTypes {
  sut: ChangePasswordController
  changePasswordStub: ChangePassword
  passwordValidatorStub: PasswordValidator
}

const makeSut = (): SutTypes => {
  const changePasswordStub = makeFakeChangePasswordUseCase()
  const passwordValidatorStub = makePasswordValidator()
  const dependencies: ChangePasswordController.Dependencies = {
    changePassword: changePasswordStub,
    passwordValidator: passwordValidatorStub
  }
  const sut = new ChangePasswordController(dependencies)
  return {
    sut,
    changePasswordStub,
    passwordValidatorStub
  }
}

describe('ChangePasswordController', () => {
  describe('test the id field', () => {
    it('Should return 400 if no userId is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = makeFakeChangePasswordRequest({ withUserId: false })

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
    })
  })

  describe('test the password field', () => {
    it('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = makeFakeChangePasswordRequest({ fields: { password: undefined } })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    it('Should return 400 if an invalid password is provided', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest = makeFakeChangePasswordRequest({
        fields: {
          password: 'invalid_password',
          passwordConfirmation: 'invalid_password'
        }
      })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new PasswordRequirementsError()))
    })

    it('Should call PasswordValidator with correct password', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(passwordValidatorStub, 'isValid')

      const httpRequest = makeFakeChangePasswordRequest({
        fields: {
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      })
      await sut.handle(httpRequest)

      expect(isValidSpy).toHaveBeenCalledWith('valid_password')
    })

    it('Should return 500 if PasswordValidator throws', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const httpRequest = makeFakeChangePasswordRequest()
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the passwordConfirmation field', () => {
    it('Should return 400 if no password confirmation is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeChangePasswordRequest({ fields: { passwordConfirmation: undefined } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    it('Should return 400 if password is not equal to password confirmation', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest = makeFakeChangePasswordRequest({ fields: { passwordConfirmation: 'invalid_password' } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new PasswordMismatchError()))
    })
  })

  describe('test the execution of the ChangePassword use case', () => {
    it('Should call ChangePassword with correct values', async () => {
      const { sut, changePasswordStub } = makeSut()
      const authSpy = jest.spyOn(changePasswordStub, 'change')

      const httpRequest = makeFakeChangePasswordRequest()
      await sut.handle(httpRequest)

      expect(authSpy).toHaveBeenCalledWith({
        id: 'any_id',
        password: 'any_password'
      })
    })

    it('Should return a 400 if the id does not exist in the repository', async () => {
      const { sut, changePasswordStub } = makeSut()
      jest.spyOn(changePasswordStub, 'change').mockReturnValueOnce(Promise.resolve({
        isSuccess: false, error: new NotFoundError('userId')
      }))

      const httpRequest = makeFakeChangePasswordRequest()
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new NotFoundError('userId')))
    })

    it('Should return 500 if ChangePassword throws', async () => {
      const { sut, changePasswordStub } = makeSut()
      jest.spyOn(changePasswordStub, 'change').mockReturnValueOnce(Promise.reject(new Error()))

      const httpRequest = makeFakeChangePasswordRequest()
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test changePassword controller success case', () => {
    it('Should return 200 if valid userData are provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeChangePasswordRequest()
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(success({ message: 'Password reset completed successfully' }))
    })
  })
})
