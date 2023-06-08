import { type AddGuardian } from '@/domain/use-cases'
import { type PhoneValidator, type EmailValidator, type NameValidator, type PasswordValidator } from '@/application/validation'
import { SignUpController } from '@/application/controllers'
import { badRequest, create } from '@/application/helpers'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import {
  makeEmailValidator,
  makeNameValidator,
  makePasswordValidator,
  makePhoneValidator,
  makeFakeAddGuardianUseCase,
  makeFakeSignUpRequest,
  makeFakeServerError,
  makeFakeGuardianData
} from '@/tests/utils'

interface SutTypes {
  sut: SignUpController
  addGuardianStub: AddGuardian
  emailValidatorStub: EmailValidator
  nameValidatorStub: NameValidator
  passwordValidatorStub: PasswordValidator
  phoneValidatorStub: PhoneValidator
}

const makeSut = (): SutTypes => {
  const addGuardianStub = makeFakeAddGuardianUseCase()
  const emailValidatorStub = makeEmailValidator()
  const nameValidatorStub = makeNameValidator()
  const passwordValidatorStub = makePasswordValidator()
  const phoneValidatorStub = makePhoneValidator()
  const dependencies: SignUpController.Dependencies = {
    addGuardian: addGuardianStub,
    emailValidator: emailValidatorStub,
    nameValidator: nameValidatorStub,
    passwordValidator: passwordValidatorStub,
    phoneValidator: phoneValidatorStub
  }
  const sut = new SignUpController(dependencies)
  return { sut, addGuardianStub, emailValidatorStub, nameValidatorStub, passwordValidatorStub, phoneValidatorStub }
}

describe('SignUp Controller', () => {
  describe('test the firstName and lastName field', () => {
    it('Should return 400 if no firstName is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { firstName: undefined } })

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('firstName')))
    })

    it('Should return 400 if no lastName is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { lastName: undefined } })

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('lastName')))
    })

    it('Should return 400 if an invalid name is provided', async () => {
      const { sut, nameValidatorStub } = makeSut()
      jest.spyOn(nameValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest = makeFakeSignUpRequest({ fields: { firstName: 'invalid_first_name' } })

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('name')))
    })

    it('Should call NameValidator with correct name', async () => {
      const { sut, nameValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(nameValidatorStub, 'isValid')

      const httpRequest = makeFakeSignUpRequest({ fields: { firstName: 'valid_first_name', lastName: 'valid_last_name' } })

      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('valid_first_name', 'valid_last_name')
    })

    it('Should return 500 if NameValidator throws', async () => {
      const { sut, nameValidatorStub } = makeSut()
      jest.spyOn(nameValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const httpRequest = makeFakeSignUpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the email field', () => {
    it('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { email: undefined } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpResponse = await sut.handle(makeFakeSignUpRequest({ fields: { email: 'invalid_email' } }))

      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    it('Should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

      await sut.handle(makeFakeSignUpRequest())

      expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    it('Should call return 500 if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()

      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const httpResponse = await sut.handle(makeFakeSignUpRequest())
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the phone field', () => {
    it('Should return 400 if an invalid phone is provided', async () => {
      const { sut, phoneValidatorStub } = makeSut()
      jest.spyOn(phoneValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest = makeFakeSignUpRequest({ fields: { phone: 'invalid_phone' } })

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('phone')))
    })

    it('Should call PhoneValidator with correct phone', async () => {
      const { sut, phoneValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(phoneValidatorStub, 'isValid')

      const httpRequest = makeFakeSignUpRequest({ fields: { phone: 'valid_phone' } })

      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('valid_phone')
    })

    it('Should return 500 if PhoneValidator throws', async () => {
      const { sut, phoneValidatorStub } = makeSut()
      jest.spyOn(phoneValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const httpRequest = makeFakeSignUpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the password field', () => {
    it('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { password: undefined } })

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    it('Should return 400 if an invalid password is provided', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest = makeFakeSignUpRequest({ fields: { password: 'invalid_password', passwordConfirmation: 'invalid_password' } })

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
    })

    it('Should call PasswordValidator with correct password', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(passwordValidatorStub, 'isValid')

      const httpRequest = makeFakeSignUpRequest({ fields: { password: 'valid_password', passwordConfirmation: 'valid_password' } })

      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('valid_password')
    })

    it('Should return 500 if PasswordValidator throws', async () => {
      const { sut, passwordValidatorStub } = makeSut()
      jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })

      const httpRequest = makeFakeSignUpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the passwordConfirmation field', () => {
    it('Should return 400 if no password confirmation is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { passwordConfirmation: undefined } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    it('Should return 400 if password confirmation fails', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { passwordConfirmation: 'invalid_password' } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    })
  })

  describe('test the isPrivacyPolicyAccepted field', () => {
    it('Should return 400 if isPrivacyPolicyAccepted is not provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { isPrivacyPolicyAccepted: undefined } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new MissingParamError('isPrivacyPolicyAccepted')))
    })

    it('Should return 400 if isPrivacyPolicyAccepted is false', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeSignUpRequest({ fields: { isPrivacyPolicyAccepted: false } })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new InvalidParamError('isPrivacyPolicyAccepted')))
    })
  })

  describe('test the execution of the AddGuardian use case', () => {
    it('Should return 500 if AddGuardian throws', async () => {
      const { sut, addGuardianStub } = makeSut()
      jest.spyOn(addGuardianStub, 'add').mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })

      const httpRequest = makeFakeSignUpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call AddGuardian with correct values', async () => {
      const { sut, addGuardianStub } = makeSut()
      const addGuardianSpy = jest.spyOn(addGuardianStub, 'add')

      const httpRequest = makeFakeSignUpRequest()
      await sut.handle(httpRequest)

      expect(addGuardianSpy).toHaveBeenCalledWith({
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        verificationToken: 'token dumb'
      })
    })
  })

  describe('test signup controller success case', () => {
    it('Should return 201 if valid data is provided', async () => {
      const { sut } = makeSut()

      const response = makeFakeGuardianData({ withId: true })
      const httpRequest = makeFakeSignUpRequest()
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(create(response))
    })
  })
})
