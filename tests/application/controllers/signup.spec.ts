import { InvalidParamError, MissingParamError, ServerError } from '../../../src/application/errors'
import { SignUpController } from '../../../src/application/controllers/signup'
import { type EmailValidator, type NameValidator } from '../../../src/application/validation/protocols'
import { type AddGuardian, type IAddGuardian } from 'domain/use-cases/add-guardian'
import { type Guardian } from 'domain/entities/guardian'

const makeNameValidator = (): NameValidator => {
  class NameValidatorStub implements NameValidator {
    isValid (name: string): boolean {
      return true
    }
  }
  return new NameValidatorStub()
}

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
    async add (guardian: IAddGuardian): Promise<Guardian> {
      const fakeGuardian = {
        id: 1,
        firstName: 'valid_first_name',
        lastName: 'valid_last_name',
        email: 'valid_email@mail.com',
        phone: 'valid_phone',
        password: 'valid_password',
        isProvicyPolicyAccepted: true
      }

      return await new Promise(resolve => { resolve(fakeGuardian) })
    }
  }
  return new AddGuardianStub()
}

interface SutTypes {
  sut: SignUpController
  addGuardianStub: AddGuardian
  emailValidatorStub: EmailValidator
  nameValidatorStub: NameValidator
}

const makeSut = (): SutTypes => {
  const addGuardianStub = makeAddGuardian()
  const emailValidatorStub = makeEmailValidator()
  const nameValidatorStub = makeNameValidator()
  const sut = new SignUpController(addGuardianStub, emailValidatorStub, nameValidatorStub)
  return { sut, addGuardianStub, emailValidatorStub, nameValidatorStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no firstName is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('firstName'))
  })

  it('Should return 400 if no lastName is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('lastName'))
  })

  it('Should return 400 if no email is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if password confirmation fails', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if isProvicyPolicyAccepted is not provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('isProvicyPolicyAccepted'))
  })

  it('Should return 400 if isProvicyPolicyAccepted is false', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('isProvicyPolicyAccepted'))
  })

  it('Should return 400 if an invalid firstName is provided', async () => {
    const { sut, nameValidatorStub } = makeSut()
    jest.spyOn(nameValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        firstName: 'invalid_first_name',
        lastName: 'any_last_name',
        email: 'invalid_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('firstName'))
  })

  it('Should call NameValidator with correct firstName', async () => {
    const { sut, nameValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(nameValidatorStub, 'isValid')
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
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_first_name')
  })

  it('Should return 500 if NameValidator throws', async () => {
    const { sut, nameValidatorStub } = makeSut()
    jest.spyOn(nameValidatorStub, 'isValid').mockImplementationOnce(() => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 400 if an invalid email is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', async () => {
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
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AddGuardian throws', async () => {
    const { sut, addGuardianStub } = makeSut()
    jest.spyOn(addGuardianStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AddGuardian with correct values', async () => {
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
    await sut.handle(httpRequest)
    expect(addGuardianSpy).toHaveBeenCalledWith({
      firstName: 'any_first_name',
      lastName: 'any_last_name',
      email: 'any_email@mail.com',
      phone: 'any_phone',
      password: 'any_password',
      isProvicyPolicyAccepted: true
    })
  })

  it('Should return 200 if valid data is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
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
