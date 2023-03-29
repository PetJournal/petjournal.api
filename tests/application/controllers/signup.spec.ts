import { InvalidParamError, MissingParamError, ServerError } from '../../../src/application/errors'
import { SignUpController } from '../../../src/application/controllers/signup'
import { type EmailValidator } from 'application/validation/email-validator'
import { type AddGuardian, type IAddGuardian } from 'domain/use-cases/add-guardian'
import { type Guardian } from 'domain/entities/guardian'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddGuardian = (): AddGuardian => {
  class AddGuardianStub implements AddGuardian {
    add (guardian: IAddGuardian): Guardian {
      const fakeGuardian = {
        id: 1,
        firstName: 'valid_first_name',
        lastName: 'valid_last_name',
        email: 'valid_email@mail.com',
        phone: 'valid_phone',
        password: 'valid_password',
        isProvicyPolicyAccepted: true
      }

      return fakeGuardian
    }
  }
  return new AddGuardianStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addGuardianStub: AddGuardian
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addGuardianStub = makeAddGuardian()
  const sut = new SignUpController(emailValidatorStub, addGuardianStub)
  return { sut, emailValidatorStub, addGuardianStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no firstName is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('firstName'))
  })

  it('Should return 400 if no lastName is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('lastName'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if isProvicyPolicyAccepted is not provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('isProvicyPolicyAccepted'))
  })

  it('Should return 400 if isProvicyPolicyAccepted is false', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: false
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('isProvicyPolicyAccepted'))
  })

  it('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'invalid_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AddGuardian throws', () => {
    const { sut, addGuardianStub } = makeSut()
    jest.spyOn(addGuardianStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AddGuardian with correct values', () => {
    const { sut, addGuardianStub } = makeSut()
    const addGuardianSpy = jest.spyOn(addGuardianStub, 'add')
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    sut.handle(httpRequest)
    expect(addGuardianSpy).toHaveBeenCalledWith({
      firstName: 'any_first_name',
      lastName: 'any_last_name',
      email: 'any_email@mail.com',
      phone: 'any_phone',
      password: 'any_password',
      isProvicyPolicyAccepted: true
    })
  })

  it('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'valid_first_name',
        lastName: 'valid_last_name',
        email: 'valid_email@mail.com',
        phone: 'valid_phone',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 1,
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email@mail.com',
      phone: 'valid_phone',
      password: 'valid_password',
      isProvicyPolicyAccepted: true
    })
  })
})
