import { type SendEmail, type AddGuardian } from '@/domain/use-cases'
import { type Validation } from '@/application/protocols'
import { SignUpController } from '@/application/controllers'
import {
  makeFakeAddGuardianUseCase,
  makeFakeSendEmailUseCase,
  makeFakeServerError,
  makeFakeSignUpRequest,
  makeFakeValidation
} from '@/tests/utils'
import { badRequest, conflict, create, createWithWarning } from '@/application/helpers'
import { ConflictGuardianError, MissingParamError, EmailServiceError } from '@/application/errors'

interface SutTypes {
  sut: SignUpController
  addGuardianStub: AddGuardian
  validationStub: Validation
  sendEmailStub: SendEmail
}

const makeSut = (): SutTypes => {
  const addGuardianStub = makeFakeAddGuardianUseCase()
  const sendEmailStub = makeFakeSendEmailUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: SignUpController.Dependencies = {
    addGuardian: addGuardianStub,
    validation: validationStub,
    sendEmail: sendEmailStub
  }
  const sut = new SignUpController(dependencies)
  return { sut, addGuardianStub, validationStub, sendEmailStub }
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
        verificationToken: '',
        image: httpRequest.file
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
      expect(sendSpy).toHaveBeenCalledWith({
        id: 'any_id',
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com'
      })
    })

    it('Should return 500 (ServerError) if SendEmail throws generic Error', async () => {
      const { sut, sendEmailStub } = makeSut()
      jest.spyOn(sendEmailStub, 'send').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 201 (Created) with warning if SendEmail throws EmailServiceError', async () => {
      const { sut, sendEmailStub } = makeSut()
      jest.spyOn(sendEmailStub, 'send').mockRejectedValue(new EmailServiceError())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(createWithWarning({
        id: 'any_id',
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        phone: 'any_phone',
        image: ''
      }, 'email_failed', 'O cadastro foi realizado com sucesso, mas ocorreu uma falha ao enviar o e-mail de confirmação.'))
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
