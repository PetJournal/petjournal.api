import { type ChangePassword } from '@/domain/use-cases'
import { type PasswordValidator } from '@/application/validation'
import { ChangePasswordController } from '@/application/controllers'
import { MissingParamError, NotFoundError, PasswordMismatchError, PasswordRequirementsError } from '@/application/errors'
import { badRequest, success } from '@/application/helpers'
import { makeChangePassword, makeFakeServerError, makePasswordValidator } from '@/tests/utils'

interface SutTypes {
  sut: ChangePasswordController
  changePasswordStub: ChangePassword
  passwordValidatorStub: PasswordValidator
}

const makeSut = (): SutTypes => {
  const changePasswordStub = makeChangePassword()
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
    it('Should return 400 if no id is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
    })
  })

  describe('test the password field', () => {
    it('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        userId: 'any_id',
        body: {
          passwordConfirmation: 'any_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    it('Should return 400 if an invalid password is provided', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'invalid_password',
          passwordConfirmation: 'invalid_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new PasswordRequirementsError()))
    })

    it('Should call PasswordValidator with correct password', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(passwordValidatorStub, 'isValid')

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      }

      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('valid_password')
    })

    it('Should return 500 if PasswordValidator throws', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the passwordConfirmation field', () => {
    it('Should return 400 if no password confirmation is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'any_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    it('Should return 400 if password is not equal to password confirmation', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'any_password',
          passwordConfirmation: 'invalid_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new PasswordMismatchError()))
    })
  })

  describe('test the execution of the ChangePassword use case', () => {
    it('Should call ChangePassword with correct values', async () => {
      const { sut, changePasswordStub } = makeSut()
      const authSpy = jest.spyOn(changePasswordStub, 'change')

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
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

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new NotFoundError('userId')))
    })

    it('Should return 500 if ChangePassword throws', async () => {
      const { sut, changePasswordStub } = makeSut()
      jest.spyOn(changePasswordStub, 'change').mockReturnValueOnce(Promise.reject(new Error()))

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test changePassword controller success case', () => {
    it('Should return 200 if valid userData are provided', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        userId: 'any_id',
        body: {
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(success({ message: 'Password reset completed successfully' }))
    })
  })
})
