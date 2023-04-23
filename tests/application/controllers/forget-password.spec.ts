import { ForgetPasswordController } from '@/application/controllers/forget-password'
import { type EmailValidator } from '@/application/validation/protocols'
import { ServerError } from '@/application/errors'
import { type LoadGuardianByEmail } from '@/domain/use-cases/load-guardian-by-email'
import { type TokenGenerator } from '@/data/protocols/recovery-password/token-generator'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeLoadGuardianByEmail = (): LoadGuardianByEmail => {
  class LoadGuardianByEmailStub implements LoadGuardianByEmail {
    async load (email: string): Promise<LoadGuardianByEmail.Result> {
      return {
        id: 1,
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
  }
  return new LoadGuardianByEmailStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (tokenSize: number): Promise<string> {
      return await new Promise(resolve => { resolve('123456') })
    }
  }
  return new TokenGeneratorStub()
}

interface SutTypes {
  sut: ForgetPasswordController
  emailValidatorStub: EmailValidator
  loadGuardianByEmail: LoadGuardianByEmail
  tokenGenerator: TokenGenerator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const loadGuardianByEmail = makeLoadGuardianByEmail()
  const tokenGenerator = makeTokenGenerator()
  const sut = new ForgetPasswordController(emailValidatorStub, loadGuardianByEmail, tokenGenerator)
  return {
    sut,
    emailValidatorStub,
    loadGuardianByEmail,
    tokenGenerator
  }
}

describe('ForgetPassword Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
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
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if LoadGuardianByEmail throws', async () => {
    const { sut, loadGuardianByEmail } = makeSut()
    jest.spyOn(loadGuardianByEmail, 'load').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call LoadGuardianByEmail with correct value', async () => {
    const { sut, loadGuardianByEmail } = makeSut()
    const loadSpy = jest.spyOn(loadGuardianByEmail, 'load')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should TokenGenerator return a token', async () => {
    const { sut, tokenGenerator } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGenerator, 'generate')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    await sut.handle(httpRequest)
    expect(tokenGeneratorSpy).toHaveBeenCalled()
    expect(tokenGeneratorSpy).toBeCalledWith(6)
  })
})
