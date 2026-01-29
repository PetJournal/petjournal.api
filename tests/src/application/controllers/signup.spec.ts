import { type SendEmail, type AddGuardian } from '@/domain/use-cases'
import { type Validation } from '@/application/protocols'
import { SignUpController } from '@/application/controllers'
import {
  makeFakeAddGuardianUseCase,
  makeFakeLogger,
  makeFakeSendEmailUseCase,
  makeFakeServerError,
  makeFakeSignUpRequest,
  makeFakeValidation
} from '@/tests/utils'
import { badRequest, conflict, create } from '@/application/helpers'
import { ConflictGuardianError, MissingParamError } from '@/application/errors'
import { type Logger } from '@/data/protocols'

interface SutTypes {
  sut: SignUpController
  addGuardianStub: AddGuardian
  validationStub: Validation
  sendEmailStub: SendEmail
  loggerStub: Logger
}

const makeSut = (): SutTypes => {
  const addGuardianStub = makeFakeAddGuardianUseCase()
  const sendEmailStub = makeFakeSendEmailUseCase()
  const validationStub = makeFakeValidation()
  const loggerStub = makeFakeLogger()
  const dependencies: SignUpController.Dependencies = {
    addGuardian: addGuardianStub,
    validation: validationStub,
    sendEmail: sendEmailStub,
    logger: loggerStub
  }
  const sut = new SignUpController(dependencies)
  return { sut, addGuardianStub, validationStub, sendEmailStub, loggerStub }
}

describe('SignUp Controller', () => {
  const httpRequest = makeFakeSignUpRequest()

  describe('AddGuardian', () => {
    it('Should return 409 (Conflict) if AddGuardian returns null', async () => {
      const { sut, addGuardianStub } = makeSut()
      jest.spyOn(addGuardianStub, 'add').mockResolvedValue(undefined)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(conflict(new ConflictGuardianError()))
    })

    it('Should return 500 (ServerError) if AddGuardian throws', async () => {
      const { sut, addGuardianStub } = makeSut()
      jest.spyOn(addGuardianStub, 'add').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call AddGuardian with correct values', async () => {
      const { sut, addGuardianStub } = makeSut()
      const addGuardianSpy = jest.spyOn(addGuardianStub, 'add')
      await sut.handle(httpRequest)
      expect(addGuardianSpy).toHaveBeenCalledWith({
        firstName: httpRequest.body.firstName,
        lastName: httpRequest.body.lastName,
        email: httpRequest.body.email,
        password: httpRequest.body.password,
        phone: httpRequest.body.phone,
        verificationToken: ''
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
        firstName: httpRequest.body.firstName,
        lastName: httpRequest.body.lastName,
        email: httpRequest.body.email,
        phone: httpRequest.body.phone,
        password: httpRequest.body.password,
        passwordConfirmation: httpRequest.body.passwordConfirmation
      })
    })
  })

  describe('SendEmail', () => {
    it('Should call SendEmail with correct value', async () => {
      const { sut, sendEmailStub } = makeSut()
      const sendSpy = jest.spyOn(sendEmailStub, 'send')
      await sut.handle(httpRequest)
      expect(sendSpy).toHaveBeenCalledWith({ email: httpRequest.body.email })
    })

    it('Should return 500 (ServerError) if SendEmail throws', async () => {
      const { sut, sendEmailStub } = makeSut()
      jest.spyOn(sendEmailStub, 'send').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('Logger', () => {
    it('Should call logger.error if AddGuardian throws', async () => {
      const { sut, addGuardianStub, loggerStub } = makeSut()

      const loggerErrorSpy = jest.spyOn(loggerStub, 'error')

      const error = new Error('any_error')
      jest.spyOn(addGuardianStub, 'add').mockRejectedValue(error)

      await sut.handle(httpRequest)

      expect(loggerErrorSpy).toHaveBeenCalledWith(error.message, error)
    })
  })

  test('Should return 201 (Created) if valid data are provide', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toMatchObject(create({
      firstName: httpRequest.body.firstName,
      lastName: httpRequest.body.lastName,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
      phone: httpRequest.body.phone
    }))
  })
})
