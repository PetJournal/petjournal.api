import { ForgetPasswordController } from '@/application/controllers/forget-password'
import { type EmailValidator } from '@/application/validation/protocols'
import { ServerError } from '@/application/errors'
import { type LoadGuardianByEmail } from '@/domain/use-cases/load-guardian-by-email'
import { type TokenGenerator } from '@/data/protocols/recovery-password/token-generator'
import { type EmailOptions, type EmailService } from '@/domain/use-cases'

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

const makeEmailService = (): EmailService => {
  class EmailServiceStub implements EmailService {
    async send (options: EmailOptions): Promise<boolean> {
      return await new Promise(resolve => { resolve(true) })
    }
  }
  return new EmailServiceStub()
}

interface SutTypes {
  sut: ForgetPasswordController
  emailValidatorStub: EmailValidator
  loadGuardianByEmailStub: LoadGuardianByEmail
  tokenGeneratorStub: TokenGenerator
  emailServiceStub: EmailService
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const loadGuardianByEmailStub = makeLoadGuardianByEmail()
  const tokenGeneratorStub = makeTokenGenerator()
  const emailServiceStub = makeEmailService()
  const sut = new ForgetPasswordController(emailValidatorStub, loadGuardianByEmailStub, tokenGeneratorStub, emailServiceStub)
  return {
    sut,
    emailValidatorStub,
    loadGuardianByEmailStub,
    tokenGeneratorStub,
    emailServiceStub
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
    const { sut, loadGuardianByEmailStub } = makeSut()
    jest.spyOn(loadGuardianByEmailStub, 'load').mockImplementationOnce(async () => {
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
    const { sut, loadGuardianByEmailStub } = makeSut()
    const loadSpy = jest.spyOn(loadGuardianByEmailStub, 'load')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should TokenGenerator return a token', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    await sut.handle(httpRequest)
    expect(tokenGeneratorSpy).toHaveBeenCalled()
    expect(tokenGeneratorSpy).toBeCalledWith(6)
  })

  it('Should call EmailService with correct values', async () => {
    const { sut, emailServiceStub } = makeSut()
    const sendSpy = jest.spyOn(emailServiceStub, 'send')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    await sut.handle(httpRequest)
    expect(sendSpy).toHaveBeenCalledWith({
      from: '',
      to: 'any_email@mail.com',
      subject: 'Recuperação de senha',
      text: 'Olá any_first_name any_last_name, seu código de recuperação de senha é: 123456.'
    })
    expect(sendSpy).toBeTruthy()
  })
})
