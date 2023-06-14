import {
  type UpdateVerificationTokenRepository,
  type LoadGuardianByEmailRepository,
  type TokenGenerator,
  type HashGenerator
} from '@/data/protocols'
import { DbForgetPassword } from '@/data/use-cases'
import { type EmailService, type ForgetPassword } from '@/domain/use-cases'
import {
  makeEncrypter,
  makeFakeGuardianWithIdData,
  makeLoadGuardianByEmail,
  makeTokenGenerator,
  makeUpdateVerificationTokenRepository
} from '@/tests/utils'

describe('DbForgetPassword UseCase', () => {
  const makeEmailService = (): EmailService => {
    class EmailServiceStub implements EmailService {
      async send (options: EmailService.Options): Promise<boolean> {
        return await new Promise(resolve => { resolve(true) })
      }
    }
    return new EmailServiceStub()
  }

  interface SutTypes {
    sut: DbForgetPassword
    loadGuardianByEmailStub: LoadGuardianByEmailRepository
    updateVerificationTokenRepositoryStub: UpdateVerificationTokenRepository
    tokenGeneratorStub: TokenGenerator
    emailServiceStub: EmailService
    hashServiceStub: HashGenerator
  }

  const makeSut = (): SutTypes => {
    const dependencies: ForgetPassword.Dependencies = {
      loadGuardianByEmailRepository: makeLoadGuardianByEmail(makeFakeGuardianWithIdData()),
      tokenGenerator: makeTokenGenerator(),
      emailService: makeEmailService(),
      hashService: makeEncrypter(),
      updateVerificationTokenRepository: makeUpdateVerificationTokenRepository()
    }
    const sut = new DbForgetPassword(dependencies)
    return {
      sut,
      loadGuardianByEmailStub: dependencies.loadGuardianByEmailRepository,
      updateVerificationTokenRepositoryStub: dependencies.updateVerificationTokenRepository,
      hashServiceStub: dependencies.hashService,
      tokenGeneratorStub: dependencies.tokenGenerator,
      emailServiceStub: dependencies.emailService
    }
  }

  it('Should return 500 if LoadGuardianByEmail throws', async () => {
    const { sut, loadGuardianByEmailStub } = makeSut()
    jest.spyOn(loadGuardianByEmailStub, 'loadByEmail').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const promise = sut.forgetPassword({ email: 'any_email@mail.com' })
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadGuardianByEmail with correct value', async () => {
    const { sut, loadGuardianByEmailStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadGuardianByEmailStub, 'loadByEmail')

    await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should call HashService with correct value', async () => {
    const { sut, hashServiceStub } = makeSut()
    const encryptSpy = jest.spyOn(hashServiceStub, 'encrypt')
    await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(encryptSpy).toBeCalled()
  })

  it('Should throw if HashService throws', async () => {
    const { sut, hashServiceStub } = makeSut()
    jest.spyOn(hashServiceStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.forgetPassword({ email: 'any_email@mail.com' })
    await expect(promise).rejects.toThrow()
  })

  it('Should call UpdateVerificationTokenRepository with correct values', async () => {
    const { sut, updateVerificationTokenRepositoryStub } = makeSut()
    const forgetPasswordSpy = jest.spyOn(updateVerificationTokenRepositoryStub, 'updateVerificationToken')
    await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(forgetPasswordSpy).toHaveBeenCalledWith({ userId: 'valid_id', token: 'hashed_password' })
  })

  it('Should throw if UpdateVerificationTokenRepository throws', async () => {
    const { sut, updateVerificationTokenRepositoryStub } = makeSut()
    jest.spyOn(updateVerificationTokenRepositoryStub, 'updateVerificationToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.forgetPassword({ email: 'any_email@mail.com' })
    await expect(promise).rejects.toThrow()
  })

  it('Should TokenGenerator return a token', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(generateSpy).toHaveBeenCalled()
    expect(generateSpy).toBeCalledWith('valid_id')
  })

  it('Should call EmailService with correct values', async () => {
    const { sut, emailServiceStub } = makeSut()
    const sendSpy = jest.spyOn(emailServiceStub, 'send')

    await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(sendSpy).toHaveBeenCalledWith({
      from: 'contato.petjournal@gmail.com',
      to: 'any_email@mail.com',
      subject: 'valid_first_name valid_last_name, aqui está seu código',
      text: `
          Olá valid_first_name valid_last_name,\n
          Recebemos uma solicitação para redefinir a senha de sua conta PetJournal.\n
          any_token\n
          Insira este código para concluir a redefinição.\n
          Obrigado por nos ajudar a manter sua conta segura.\n
          Equipe PetJournal
        `
    })
    expect(sendSpy).toBeTruthy()
  })

  it('Should return false if LoadGuardianByEmail returns undefined', async () => {
    const { sut, loadGuardianByEmailStub } = makeSut()
    jest.spyOn(loadGuardianByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(undefined))
    const isSuccess = await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(isSuccess).toBe(false)
  })

  it('Should return true if all succeeds', async () => {
    const { sut } = makeSut()
    const isSuccess = await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(isSuccess).toBe(true)
  })
})
