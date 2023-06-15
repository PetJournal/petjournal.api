import {
  type TokenGenerator,
  type LoadGuardianByEmailRepository,
  type EmailService
} from '@/data/protocols'
import { DbForgetPassword } from '@/data/use-cases'
import { type ForgetPassword } from '@/domain/use-cases'
import {
  type Guardian,
  makeEmailService,
  makeFakeGuardianData,
  makeGuardianRepository,
  makeTokenService
} from '@/tests/utils'

interface SutTypes {
  sut: DbForgetPassword
  guardianRepositoryStub: LoadGuardianByEmailRepository
  tokenServiceStub: TokenGenerator
  emailServiceStub: EmailService
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeGuardianRepository(
    makeFakeGuardianData({ withId: true }) as Guardian & { id: string }
  )
  const tokenServiceStub = makeTokenService()
  const emailServiceStub = makeEmailService()
  const dependencies: ForgetPassword.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    tokenService: tokenServiceStub,
    emailService: emailServiceStub
  }
  const sut = new DbForgetPassword(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    tokenServiceStub,
    emailServiceStub
  }
}

describe('DbForgetPassword UseCase', () => {
  it('Should return 500 if LoadGuardianByEmail throws', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const promise = sut.forgetPassword({ email: 'any_email@mail.com' })
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadGuardianByEmail with correct value', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')

    await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should TokenGenerator return a token', async () => {
    const { sut, tokenServiceStub } = makeSut()
    const generateSpy = jest.spyOn(tokenServiceStub, 'generate')

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
    const { sut, guardianRepositoryStub } = makeSut()
    jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(undefined))
    const isSuccess = await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(isSuccess).toBe(false)
  })

  it('Should return true if all succeeds', async () => {
    const { sut } = makeSut()
    const isSuccess = await sut.forgetPassword({ email: 'any_email@mail.com' })
    expect(isSuccess).toBe(true)
  })
})
